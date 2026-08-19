import { Agent, routeAgentRequest, callable } from 'agents';
import { FACTS, type Fact } from './facts';
import { write_cards, render_card, type Card } from './generate';
import { post_tiktok, post_x, type PostResult } from './post';

export type Env = {
	Episodes: DurableObjectNamespace;
	MEDIA: R2Bucket;
	OPENROUTER_API_KEY: string;
	DRAFT_MODEL: string;
	PROD_MODEL: string;
	WRITER_MODEL: string;
	REVIEW_TOKEN?: string;
	PUBLIC_BASE?: string;
	TIKTOK_ACCESS_TOKEN?: string;
	TIKTOK_PUBLIC?: string;
	X_API_KEY?: string;
	X_API_SECRET?: string;
	X_ACCESS_TOKEN?: string;
	X_ACCESS_SECRET?: string;
};

type Episode = {
	id: string;
	factId: number;
	claim: string;
	cards: Card[];
	keys: string[];
	caption: string;
	status: 'drafting' | 'awaiting_approval' | 'posted' | 'failed';
	error?: string;
	results?: PostResult[];
	createdAt: string;
};

type State = { used: number[]; current: Episode | null; log: string[] };

const DISCLAIMER =
	'Attorney advertising, results may vary. Beware of scammers: this is the only official account of Hogan & Crown Law, and we will never request funds in any form.';

export class Episodes extends Agent<Env, State> {
	initialState: State = { used: [1, 2], current: null, log: [] };

	// Fired by the daily cron. Drafts one episode and stops. It never posts on its own, because
	// these are legal claims published under a named attorney and every one so far has needed a
	// human to change something.
	async draft() {
		const fact = this.next_fact();
		if (!fact) return this.note('fact bank exhausted, add more from the answers page');

		const id = `${new Date().toISOString().slice(0, 10)}-${fact.id}`;
		const ep: Episode = {
			id,
			factId: fact.id,
			claim: fact.claim,
			cards: [],
			keys: [],
			caption: '',
			status: 'drafting',
			createdAt: new Date().toISOString()
		};
		this.setState({ ...this.state, current: ep });

		try {
			const cards = await write_cards(this.env, fact);
			const styleRef = await this.style_ref();
			const keys: string[] = [];
			for (let i = 0; i < cards.length; i++) {
				const bytes = await render_card(this.env, cards[i], styleRef);
				const key = `${id}/${i}.png`;
				await this.env.MEDIA.put(key, bytes, { httpMetadata: { contentType: 'image/png' } });
				keys.push(key);
			}
			const endcard = await this.env.MEDIA.get('static/endcard.png');
			if (endcard) keys.push('static/endcard.png');

			const done: Episode = {
				...ep,
				cards,
				keys,
				caption: `${cards[cards.length - 1].line}\n\n${fact.detail}\n\nComment "CALL" to book a consultation.\n\n${DISCLAIMER}`,
				status: 'awaiting_approval'
			};
			this.setState({ ...this.state, current: done });
			this.note(`drafted ${id}: ${fact.claim}`);
		} catch (e) {
			this.setState({ ...this.state, current: { ...ep, status: 'failed', error: String(e).slice(0, 300) } });
			this.note(`failed ${id}: ${String(e).slice(0, 200)}`);
		}
	}

	// Called by a human, after looking at the pictures.
	@callable()
	async approve(): Promise<PostResult[]> {
		const ep = this.state.current;
		if (!ep || ep.status !== 'awaiting_approval') throw new Error('nothing awaiting approval');

		const base = this.env.PUBLIC_BASE;
		const urls = base ? ep.keys.map((k) => `${base}/media/${k}`) : [];
		const bytes: Uint8Array[] = [];
		for (const k of ep.keys.slice(0, 4)) {
			const o = await this.env.MEDIA.get(k);
			if (o) bytes.push(new Uint8Array(await o.arrayBuffer()));
		}

		const results = [
			urls.length
				? await post_tiktok(this.env, urls, ep.caption)
				: { platform: 'tiktok', ok: false, detail: 'PUBLIC_BASE not set, tiktok needs public image urls' },
			await post_x(this.env, bytes, ep.caption.slice(0, 270))
		];

		const posted = results.some((r) => r.ok);
		this.setState({
			...this.state,
			used: [...this.state.used, ep.factId],
			current: { ...ep, status: posted ? 'posted' : 'failed', results }
		});
		this.note(`approve ${ep.id}: ${results.map((r) => `${r.platform} ${r.ok ? 'ok' : r.detail}`).join(' | ')}`);
		return results;
	}

	// Daily schedule lives on the durable object's alarm, not a worker cron trigger, because the
	// account is capped at five cron triggers and alarms are not.
	@callable()
	async arm(cron = '0 9 * * *') {
		for (const s of await this.getSchedules()) await this.cancelSchedule(s.id);
		const s = await this.schedule(cron, 'draft');
		this.note(`armed ${cron}`);
		return s;
	}

	@callable()
	async disarm() {
		for (const s of await this.getSchedules()) await this.cancelSchedule(s.id);
		this.note('disarmed');
	}

	@callable()
	async reject(reason: string) {
		const ep = this.state.current;
		if (ep) this.note(`rejected ${ep.id}: ${reason}`);
		this.setState({ ...this.state, current: null });
	}

	@callable()
	async status() {
		return { current: this.state.current, used: this.state.used, log: this.state.log.slice(-20) };
	}

	private next_fact(): Fact | undefined {
		return FACTS.find((f) => !this.state.used.includes(f.id));
	}

	private async style_ref(): Promise<string | null> {
		const o = await this.env.MEDIA.get('static/style-ref.png');
		if (!o) return null;
		const b = new Uint8Array(await o.arrayBuffer());
		let s = '';
		for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
		return `data:image/png;base64,${btoa(s)}`;
	}

	private note(line: string) {
		const stamped = `${new Date().toISOString()} ${line}`;
		this.setState({ ...this.state, log: [...this.state.log, stamped].slice(-100) });
		console.log(stamped);
	}
}

const agent = (env: Env) => env.Episodes.get(env.Episodes.idFromName('hgc')) as unknown as Episodes;

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		// R2 passthrough. TikTok pulls the images from here, so it has to be reachable without auth.
		if (url.pathname.startsWith('/media/')) {
			const o = await env.MEDIA.get(url.pathname.slice('/media/'.length));
			if (!o) return new Response('not found', { status: 404 });
			return new Response(o.body, { headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=3600' } });
		}

		// Everything else is the operator surface and needs the token.
		if (env.REVIEW_TOKEN && url.searchParams.get('t') !== env.REVIEW_TOKEN) {
			return new Response('unauthorised', { status: 401 });
		}

		const a = agent(env) as any;
		if (url.pathname === '/draft') { ctx.waitUntil(a.draft()); return json({ started: true }); }
		if (url.pathname === '/arm') return json(await a.arm(url.searchParams.get('cron') ?? undefined));
		if (url.pathname === '/disarm') return json(await a.disarm());
		if (url.pathname === '/status') return json(await a.status());
		if (url.pathname === '/approve') return json(await a.approve());
		if (url.pathname === '/reject') return json(await a.reject(url.searchParams.get('why') ?? 'no reason given'));
		if (url.pathname === '/' || url.pathname === '/review') return review_page(await a.status(), url);

		return (await routeAgentRequest(request, env)) ?? new Response('not found', { status: 404 });
	}
} satisfies ExportedHandler<Env>;

const json = (v: unknown) => new Response(JSON.stringify(v, null, 2), { headers: { 'content-type': 'application/json' } });

function review_page(s: { current: Episode | null }, url: URL): Response {
	const t = url.searchParams.get('t') ?? '';
	const ep = s.current;
	const body = !ep
		? '<p>nothing drafted.</p>'
		: `<h2>${ep.claim}</h2>
<p><b>${ep.status}</b> &middot; ${ep.id}${ep.error ? ` &middot; ${esc(ep.error)}` : ''}</p>
<div class=g>${ep.keys.map((k) => `<img src="/media/${k}">`).join('')}</div>
<pre>${esc(ep.caption)}</pre>
${ep.status === 'awaiting_approval' ? `<p><a class=b href="/approve?t=${t}">approve and post</a> <a class=b href="/reject?t=${t}&why=no">reject</a></p>` : ''}`;
	return new Response(
		`<meta name=viewport content="width=device-width,initial-scale=1"><style>
body{font:15px/1.5 system-ui;margin:0 auto;padding:24px;max-width:900px;background:#15171b;color:#f1f2ee}
.g{display:flex;gap:8px;overflow-x:auto}img{height:340px;border-radius:6px}
pre{white-space:pre-wrap;background:#1e2024;padding:12px;border-radius:6px}
.b{display:inline-block;padding:10px 16px;background:#1e4034;color:#f1f2ee;text-decoration:none;border-radius:4px}
</style><h1>hogan &amp; crown &mdash; episode review</h1>${body}`,
		{ headers: { 'content-type': 'text/html; charset=utf-8' } }
	);
}

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);
