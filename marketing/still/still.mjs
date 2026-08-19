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
	const draft = process.argv[5] === 'draft';
	const model = draft ? style.draft_model : style.prod_model;
	const idx = arg === 'all' ? spec.cards.map((_, i) => i) : [Number(arg)];
	const bal = (await api('/key')).data.limit_remaining;
	console.error(`${idx.length} still(s) on ${model}, balance $${bal.toFixed(2)}`);
	for (const i of idx) {
		const c = spec.cards[i];
		const prompt = `THIS IS A SINGLE FRAME FROM A PAINTED 3D ANIMATED FEATURE FILM. it is not a photograph, not live action, and not an oil painting on canvas. it is animation. every surface is built from flat simplified planes of painted colour with soft painted edges, the way a background painter blocks in a shape. there is no photographic surface texture, no visible fabric weave or carpet fibre, no volumetric light shafts or god rays, no realistic depth of field, no render sheen and no specular highlights. light falls as broad flat painted shapes, not as simulated beams.

${style.look}

palette: cold teal green ground against a warm amber key. no magenta, no pink, no purple.

${c.scene}

the words "${c.line}" appear in this picture, and they are physically part of the scene, never printed over it. ${c.text_in}. the lettering is large, plain, lowercase, on two lines. nothing else in the picture carries any writing.

vertical 9:16. no watermark, no logo, no caption bar, no border.`;
		const gen = async (body) => {
			const j = await api('/images', { method: 'POST', body: JSON.stringify(body) });
			const d = j.data?.[0];
			const b64 = d?.b64_json ?? (d?.url?.startsWith('data:') ? d.url.split(',')[1] : null);
			if (!b64) die(`card ${i}: no image ${JSON.stringify(j).slice(0, 300)}`);
			return Buffer.from(b64, 'base64');
		};

		// pass one: the cheap model paints the scene in the house style
		const base = await gen({ model: style.draft_model, prompt, aspect_ratio: '9:16', resolution: '1K' });
		writeFileSync(p(`-d${i}.png`), base);
		if (draft) { console.log(p(`-d${i}.png`)); continue; }

		// pass two: the strong model letters the clean painting without touching the paint
		const fixed = await gen({
			model: style.prod_model,
			prompt: `the writing on ${c.surface} in this painting is misspelled nonsense. erase it completely and redraw it from scratch, spelled correctly, reading exactly these words and nothing else: "${c.line}". keep it the same size and in the same place, on two lines, plain lowercase. it must stay physically part of the scene exactly as it is now, never flat type laid on top: ${c.text_in}. everything else in the painting stays exactly as it is: same flat painted style, same colours, same light, same composition, every object where it is.`,
			input_references: [{ type: 'image_url', image_url: { url: `data:image/png;base64,${base.toString('base64')}` } }],
			aspect_ratio: '9:16',
			resolution: '1K',
			quality: 'low'
		});
		writeFileSync(p(`-${i}.png`), fixed);
		console.log(p(`-${i}.png`));
	}
}

if (cmd === 'cut') {
	const W = 1080, H = 1920, FPS = 30, F = Math.round(hold * FPS);
	const moves = {
		in:            `z='min(1+0.06*on/${F},1.06)'  :x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
		out:           `z='1.06-0.06*on/${F}'         :x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
		'drift-left':  `z='1.05':x='(iw-iw/zoom)*(1-on/${F})':y='ih/2-(ih/zoom/2)'`,
		'drift-right': `z='1.05':x='(iw-iw/zoom)*(on/${F})'  :y='ih/2-(ih/zoom/2)'`
	};

	const segs = spec.cards.map((c, i) => {
		const src = p(`-${i}.png`);
		if (!existsSync(src)) die(`missing ${src} — run pic first`);
		const seg = p(`-seg${i}.mp4`);
		execFileSync('ffmpeg', ['-y', '-loop', '1', '-i', src, '-t', String(hold),
			'-vf', `scale=${W * 2}:${H * 2}:force_original_aspect_ratio=increase,crop=${W * 2}:${H * 2},` +
				`zoompan=${moves[c.move ?? 'in']}:d=1:s=${W}x${H}:fps=${FPS},setsar=1,format=yuv420p`,
			'-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-r', String(FPS), seg],
			{ stdio: ['ignore', 'ignore', 'pipe'] });
		return seg;
	});

	if (spec.endcard) {
		const b = style.burn;
		const f = (x) => `data:font/woff2;base64,${readFileSync(x).toString('base64')}`;
		const html = p('-end.html'), png = p('-end.png'), seg = p('-segE.mp4');
		writeFileSync(html, `<meta charset="utf-8"><style>
@font-face{font-family:d;src:url('${f(b.fonts.display)}') format('woff2-variations');font-weight:200 800}
@font-face{font-family:m;src:url('${f(b.fonts.mono)}') format('woff2')}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;background:${b.paper}}
body{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;padding:0 90px}
.l{font-family:m;font-size:26px;letter-spacing:.2em;text-transform:uppercase;color:${b.muted}}
.n{font-family:d;font-size:78px;line-height:1.02;letter-spacing:-.035em;color:${b.ink};margin:36px 0 30px}
.r{width:120px;height:8px;background:${b.seal};margin-bottom:34px}
</style><div class="l">${b.endcard_label}</div><div class="n">${b.name}</div><div class="r"></div><div class="l">${b.endcard_sub}</div>`);
		execFileSync(b.chromium, ['--headless=new', '--disable-gpu', '--hide-scrollbars',
			'--force-device-scale-factor=1', `--window-size=${W},${H}`, `--screenshot=${png}`, `file://${html}`]);
		execFileSync('ffmpeg', ['-y', '-loop', '1', '-i', png, '-t', String(spec.endcard),
			'-vf', `scale=${W}:${H},setsar=1,format=yuv420p`, '-c:v', 'libx264', '-crf', '18',
			'-r', String(FPS), seg], { stdio: ['ignore', 'ignore', 'pipe'] });
		segs.push(seg);
	}

	const list = p('-list.txt');
	writeFileSync(list, segs.map((s) => `file '${s}'`).join('\n'));
	execFileSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', list,
		'-c:v', 'libx264', '-crf', '18', '-preset', 'slow', '-pix_fmt', 'yuv420p',
		'-movflags', '+faststart', p('.mp4')], { stdio: ['ignore', 'ignore', 'pipe'] });
	console.log(p('.mp4'));
}

function die(m) { console.error(m); process.exit(1); }
