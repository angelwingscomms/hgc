// Posting. Both platforms are credential-gated and both refuse loudly rather than half-posting.
//
// TikTok: the Content Posting API requires a second audit on top of developer signup. Until that
// audit passes every post is forced to SELF_ONLY, so PUBLIC is opt-in through a var rather than a
// default, and the agent says which one it used.
//
// X: needs OAuth 1.0a user context for media upload. App-only bearer tokens cannot upload media.

export type Env = {
	TIKTOK_ACCESS_TOKEN?: string;
	TIKTOK_PUBLIC?: string;
	X_API_KEY?: string;
	X_API_SECRET?: string;
	X_ACCESS_TOKEN?: string;
	X_ACCESS_SECRET?: string;
};

export type PostResult = { platform: string; ok: boolean; detail: string };

export async function post_tiktok(env: Env, imageUrls: string[], caption: string): Promise<PostResult> {
	if (!env.TIKTOK_ACCESS_TOKEN) return { platform: 'tiktok', ok: false, detail: 'TIKTOK_ACCESS_TOKEN not set' };
	const privacy = env.TIKTOK_PUBLIC === 'true' ? 'PUBLIC_TO_EVERYONE' : 'SELF_ONLY';

	const r = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`,
			'Content-Type': 'application/json; charset=UTF-8'
		},
		body: JSON.stringify({
			post_info: {
				title: caption.slice(0, 90),
				description: caption.slice(0, 4000),
				privacy_level: privacy,
				disable_comment: false,
				auto_add_music: true
			},
			source_info: { source: 'PULL_FROM_URL', photo_cover_index: 0, photo_images: imageUrls },
			post_mode: 'DIRECT_POST',
			media_type: 'PHOTO'
		})
	});
	const j = (await r.json()) as any;
	const err = j?.error?.code;
	if (err && err !== 'ok') return { platform: 'tiktok', ok: false, detail: `${err}: ${j.error.message}` };
	return { platform: 'tiktok', ok: true, detail: `${privacy} publish_id=${j?.data?.publish_id ?? '?'}` };
}

export async function post_x(env: Env, images: Uint8Array[], text: string): Promise<PostResult> {
	if (!env.X_API_KEY || !env.X_ACCESS_TOKEN) return { platform: 'x', ok: false, detail: 'X credentials not set' };
	try {
		const ids: string[] = [];
		for (const img of images.slice(0, 4)) {
			ids.push(await x_upload(env, img));
		}
		const body = JSON.stringify({ text, media: { media_ids: ids } });
		const url = 'https://api.twitter.com/2/tweets';
		const r = await fetch(url, {
			method: 'POST',
			headers: { Authorization: await oauth1(env, 'POST', url, {}), 'Content-Type': 'application/json' },
			body
		});
		const j = (await r.json()) as any;
		if (!r.ok) return { platform: 'x', ok: false, detail: JSON.stringify(j).slice(0, 200) };
		return { platform: 'x', ok: true, detail: `id=${j?.data?.id}` };
	} catch (e) {
		return { platform: 'x', ok: false, detail: String(e).slice(0, 200) };
	}
}

async function x_upload(env: Env, bytes: Uint8Array): Promise<string> {
	const url = 'https://upload.twitter.com/1.1/media/upload.json';
	const form = new FormData();
	form.append('media', new Blob([bytes], { type: 'image/png' }));
	const r = await fetch(url, { method: 'POST', headers: { Authorization: await oauth1(env, 'POST', url, {}) }, body: form });
	const j = (await r.json()) as any;
	if (!j.media_id_string) throw new Error(`x media upload: ${JSON.stringify(j).slice(0, 160)}`);
	return j.media_id_string;
}

// Minimal OAuth 1.0a signing. Only what these two calls need.
async function oauth1(env: Env, method: string, url: string, extra: Record<string, string>): Promise<string> {
	const p: Record<string, string> = {
		oauth_consumer_key: env.X_API_KEY!,
		oauth_nonce: crypto.randomUUID().replace(/-/g, ''),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
		oauth_token: env.X_ACCESS_TOKEN!,
		oauth_version: '1.0',
		...extra
	};
	const enc = (s: string) => encodeURIComponent(s).replace(/[!*'()]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
	const param = Object.keys(p).sort().map((k) => `${enc(k)}=${enc(p[k])}`).join('&');
	const base = `${method}&${enc(url)}&${enc(param)}`;
	const signingKey = `${enc(env.X_API_SECRET!)}&${enc(env.X_ACCESS_SECRET!)}`;
	const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(signingKey), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
	const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(base));
	p.oauth_signature = btoa(String.fromCharCode(...new Uint8Array(sig)));
	return 'OAuth ' + Object.keys(p).sort().map((k) => `${enc(k)}="${enc(p[k])}"`).join(', ');
}
