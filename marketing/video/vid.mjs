#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';

const [cmd, spec_path] = process.argv.slice(2);
const key = process.env.OPENROUTER_API_KEY;
if (!key) die('OPENROUTER_API_KEY is not set');
if (!cmd || !spec_path) die('usage: vid.mjs key|gen|burn|cost <spec.json>');

const spec = JSON.parse(readFileSync(spec_path, 'utf8'));
const here = dirname(resolve(spec_path));
const style = JSON.parse(readFileSync(join(here, 'style.json'), 'utf8'));
const out = join(here, 'out');
mkdirSync(out, { recursive: true });
const p = (s) => join(out, `${spec.id}${s}`);
const dur = spec.dur ?? 9;
const res = spec.resolution ?? '720p';
const kf = p('-key.png');

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

const balance = async () => (await api('/key')).data.limit_remaining;

if (cmd === 'cost') {
	const [w, h] = res === '720p' ? [720, 1280] : [480, 854];
	console.log(`${w}x${h} ${dur}s = ${((w * h * 24 * dur) / 1024).toFixed(0)} video tokens`);
	console.log(`balance $${await balance()}`);
}

if (cmd === 'key') {
	const j = await api('/chat/completions', {
		method: 'POST',
		body: JSON.stringify({
			model: 'google/gemini-3-pro-image',
			messages: [{ role: 'user', content: `${style.look}\n\n${style.set}\n\n${spec.frame}\n\nvertical 9:16 single film still. no text, no letters, no subtitles, no signage, no watermark anywhere in frame.` }],
			modalities: ['image', 'text'],
			max_tokens: 8000
		})
	});
	const url = j.choices?.[0]?.message?.images?.[0]?.image_url?.url;
	if (!url) die(`no image: ${JSON.stringify(j).slice(0, 500)}`);
	writeFileSync(kf, Buffer.from(url.split(',')[1], 'base64'));
	console.log(kf);
}

if (cmd === 'gen') {
	const body = {
		model: spec.model ?? style.model,
		prompt: `${style.look}\n\n${style.set}\n\n${spec.shot}\n\n${style.camera}\n\naudio: ${spec.audio}\n\navoid: ${style.avoid}`,
		duration: dur,
		aspect_ratio: '9:16',
		resolution: res,
		generate_audio: true
	};
	if (spec.seed !== undefined) body.seed = spec.seed;
	if (existsSync(kf))
		body.frame_images = [{
			type: 'image_url',
			image_url: { url: `data:image/png;base64,${readFileSync(kf).toString('base64')}` },
			frame_type: 'first_frame'
		}];
	console.error(`${body.model} ${dur}s ${res} — balance $${await balance()}`);
	const job = await api('/videos', { method: 'POST', body: JSON.stringify(body) });
	console.error(`job ${job.id}`);
	for (;;) {
		await new Promise((r) => setTimeout(r, 15000));
		const s = await api(`/videos/${job.id}`);
		console.error(`  ${s.status}`);
		if (s.status === 'completed') break;
		if (['failed', 'cancelled', 'expired'].includes(s.status)) die(`${s.status}: ${JSON.stringify(s.error ?? {})}`);
	}
	const r = await fetch(`https://openrouter.ai/api/v1/videos/${job.id}/content?index=0`, {
		headers: { Authorization: `Bearer ${key}` }
	});
	writeFileSync(p('-raw.mp4'), Buffer.from(await r.arrayBuffer()));
	console.log(p('-raw.mp4'));
}

if (cmd === 'burn') {
	const b = style.burn;
	const f = (path) => `data:font/woff2;base64,${readFileSync(path).toString('base64')}`;
	const shell = (body) => `<meta charset="utf-8"><style>
@font-face{font-family:d;src:url('${f(b.fonts.display)}') format('woff2-variations');font-weight:200 800}
@font-face{font-family:s;src:url('${f(b.fonts.sans)}') format('woff2-variations');font-weight:400 700}
@font-face{font-family:m;src:url('${f(b.fonts.mono)}') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;background:transparent}
body{font-family:s;display:flex;flex-direction:column}
.cap{margin-top:300px;padding:0 72px;font-size:78px;line-height:1.12;letter-spacing:-.025em;font-weight:600;color:#fff;text-shadow:0 4px 40px rgba(0,0,0,.85),0 2px 8px rgba(0,0,0,.7);white-space:pre-line}
.end{margin:auto;width:calc(100% - 144px);background:${b.paper};border-top:10px solid ${b.seal};padding:56px 48px 52px;text-align:center}
.lbl{font-family:m;font-size:24px;letter-spacing:.18em;text-transform:uppercase;color:${b.muted}}
.name{font-family:d;font-size:86px;line-height:1.02;letter-spacing:-.03em;color:${b.ink};margin:26px 0}
</style>${body}`;

	const cards = [
		...spec.captions.map((c) => shell(`<div class="cap">${c.line}</div>`)),
		shell(`<div class="end"><div class="lbl">${b.endcard_label}</div><div class="name">${b.name}</div><div class="lbl">${b.endcard_sub}</div></div>`)
	];
	const pngs = cards.map((html, i) => {
		const h = p(`-c${i}.html`), g = p(`-c${i}.png`);
		writeFileSync(h, html);
		execFileSync(b.chromium, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
			'--force-device-scale-factor=1', '--default-background-color=00000000',
			'--window-size=1080,1920', `--screenshot=${g}`, `file://${h}`]);
		return g;
	});

	const times = [...spec.captions.map((c) => c.t), [dur - 1.6, dur]];
	let chain = `[0:v]scale=1080:1920:flags=lanczos,setsar=1[v0];`;
	times.forEach(([a, z], i) => {
		chain += `[v${i}][${i + 1}:v]overlay=0:0:enable='between(t,${a},${z})'[v${i + 1}];`;
	});

	execFileSync('ffmpeg', ['-y', '-i', p('-raw.mp4'), ...pngs.flatMap((g) => ['-i', g]),
		'-filter_complex', chain.slice(0, -1), '-map', `[v${times.length}]`, '-map', '0:a?',
		'-t', String(dur), '-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
		'-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', p('.mp4')], { stdio: 'inherit' });
	console.log(p('.mp4'));
}

function die(m) { console.error(m); process.exit(1); }
