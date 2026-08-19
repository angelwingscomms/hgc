#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';

const [cmd, spec_path, arg] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!cmd || !spec_path) die('usage: still.mjs pic <spec.json> <n|all> | cut <spec.json>');

const here = dirname(resolve(spec_path));
const spec = JSON.parse(readFileSync(spec_path, 'utf8'));
const style = JSON.parse(readFileSync(join(here, '..', 'video', 'style.json'), 'utf8'));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const p = (s) => join(out, `${spec.id}${s}`);
const hold = spec.hold ?? 3.5;

const api = async (path, init = {}) => {
	const r = await fetch(`https://openrouter.ai/api/v1${path}`, {
		...init,
		headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...init.headers }
	});
	const t = await r.text();
	let j;
	try { j = JSON.parse(t); } catch { die(`${path} -> ${r.status} ${t.slice(0, 400)}`); }
	if (j.error) die(`${path} -> ${JSON.stringify(j.error).slice(0, 500)}`);
	return j;
};

if (cmd === 'pic') {
	if (!key) die('OPENROUTER_API_KEY is not set');
	const prod = process.argv[5] === 'prod';
	const model = prod ? style.prod_model : style.draft_model;
	const idx = arg === 'all' ? spec.cards.map((_, i) => i) : [Number(arg)];
	console.error(`${idx.length} still(s) on ${model}, balance $${(await api('/key')).data.limit_remaining.toFixed(3)}`);

	// one fixed style reference for every card of every episode, so the look never drifts
	const refPath = join(here, style.style_ref);
	const ref = existsSync(refPath)
		? [{ type: 'image_url', image_url: { url: `data:image/png;base64,${readFileSync(refPath).toString('base64')}` } }]
		: [];

	for (const i of idx) {
		const c = spec.cards[i];
		const prompt = `${style.look}

match the painted look of the reference image exactly: the same flat simplified planes of colour, the same soft painted edges, the same cold teal green ground against a warm amber key, the same low key with large areas of near black. it is a frame from a painted animated feature, never a photograph and never a 3d render.

${c.scene}

the words "${c.line}" are cut into the scene itself, never printed on top. ${c.text_in}. every groove holds shadow down one side and catches a lit edge down the other, so the letters read as real physical depth. the carving is crude and human: the depth wanders, strokes are slightly crooked or doubled, edges are chipped, grain is torn. the lettering is large, plain, lowercase, on two lines, well inside the frame. nothing else in the picture carries any writing.

vertical 9:16. no watermark, no logo, no caption bar, no border.`;

		const body = { model, prompt, aspect_ratio: '9:16', input_references: ref };
		if (prod) body.quality = style.prod_quality ?? 'medium';
		else { body.resolution = '1K'; if (spec.seed !== undefined) body.seed = spec.seed; }

		const j = await api('/images', { method: 'POST', body: JSON.stringify(body) });
		const d = j.data?.[0];
		const b64 = d?.b64_json ?? (d?.url?.startsWith('data:') ? d.url.split(',')[1] : null);
		if (!b64) die(`card ${i}: no image ${JSON.stringify(j).slice(0, 300)}`);
		const f = p(prod ? `-${i}.png` : `-d${i}.png`);
		writeFileSync(f, Buffer.from(b64, 'base64'));
		console.log(f);
	}
}

if (cmd === 'cut') {
	const W = 1080, H = 1920, FPS = 30;
	const x = spec.xfade ?? 0.35;
	const cuts = spec.cuts ?? spec.cards.map((_, i) => (i + 1) * (spec.hold ?? 3.5));
	const holds = cuts.map((t, i) => t - (i ? cuts[i - 1] : 0));

	const seg = (src, dur, move) => {
		const f = Math.round(dur * FPS);
		const moves = {
			in:            `z='min(1+0.06*on/${f},1.06)'  :x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
			out:           `z='1.06-0.06*on/${f}'         :x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
			'drift-left':  `z='1.05':x='(iw-iw/zoom)*(1-on/${f})':y='ih/2-(ih/zoom/2)'`,
			'drift-right': `z='1.05':x='(iw-iw/zoom)*(on/${f})'  :y='ih/2-(ih/zoom/2)'`
		};
		const o = p(`-seg${move}${Math.round(dur * 100)}${src.slice(-5, -4)}.mp4`);
		execFileSync('ffmpeg', ['-y', '-loop', '1', '-i', src, '-t', String(dur),
			'-vf', `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
				`zoompan=${moves[move]}:d=1:s=${W}x${H}:fps=${FPS},setsar=1,format=yuv420p`,
			'-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-r', String(FPS), o],
			{ stdio: ['ignore', 'ignore', 'pipe'] });
		return o;
	};

	// every segment carries an extra tail so the crossfade has material to work with
	const files = spec.cards.map((c, i) => {
		const src = p(`-${i}.png`);
		if (!existsSync(src)) die(`missing ${src} — run pic first`);
		return seg(src, holds[i] + x, c.move ?? 'in');
	});

	if (holds.length > spec.cards.length) {
		const b = style.burn;
		const fnt = (v) => `data:font/woff2;base64,${readFileSync(v).toString('base64')}`;
		const html = p('-end.html'), png = p('-end.png');
		writeFileSync(html, `<meta charset="utf-8"><style>
@font-face{font-family:d;src:url('${fnt(b.fonts.display)}') format('woff2-variations');font-weight:200 800}
@font-face{font-family:m;src:url('${fnt(b.fonts.mono)}') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:${b.paper}}
body{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 90px}
.l{font-family:m;font-size:26px;letter-spacing:.2em;text-transform:uppercase;color:${b.muted}}
.n{font-family:d;font-size:78px;line-height:1.02;letter-spacing:-.035em;color:${b.ink};margin:36px 0 30px}
.r{width:120px;height:8px;background:${b.seal};margin-bottom:34px}
</style><div class="l">${b.endcard_label}</div><div class="n">${b.name}</div><div class="r"></div><div class="l">${b.endcard_sub}</div>`);
		execFileSync(b.chromium, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
			'--force-device-scale-factor=1', `--window-size=${W},${H}`, `--screenshot=${png}`, `file://${html}`]);
		files.push(seg(png, holds[holds.length - 1] + x, 'in'));
	}

	// chain crossfades, each one centred on its cut so the change lands on the strike
	let chain = '', last = '[0:v]';
	files.slice(1).forEach((_, i) => {
		const off = (cuts[i] - x / 2).toFixed(3);
		const lbl = `[x${i}]`;
		chain += `${last}[${i + 1}:v]xfade=transition=fade:duration=${x}:offset=${off}${lbl};`;
		last = lbl;
	});

	execFileSync('ffmpeg', ['-y', ...files.flatMap((f) => ['-i', f]),
		...(chain ? ['-filter_complex', chain.slice(0, -1), '-map', last] : []),
		'-t', String(cuts[cuts.length - 1]),
		'-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
		'-movflags', '+faststart', p('.mp4')], { stdio: ['ignore', 'ignore', 'pipe'] });
	console.log(p('.mp4'));
}

function die(m) { console.error(m); process.exit(1); }
