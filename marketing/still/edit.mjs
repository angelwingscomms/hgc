#!/usr/bin/env node
// one-shot image edit: hand the model a finished still and change one thing in it
import { readFileSync, writeFileSync } from 'node:fs';
const key = process.env.OPENROUTER_API_KEY;
const [src, dest, ...rest] = process.argv.slice(2);
if (!key || !src || !dest || !rest.length) {
	console.error('usage: OPENROUTER_API_KEY=... edit.mjs <src.png> <dest.png> "<instruction>"');
	process.exit(1);
}
const img = `data:image/png;base64,${readFileSync(src).toString('base64')}`;
const bal = await (await fetch('https://openrouter.ai/api/v1/key', {
	headers: { Authorization: `Bearer ${key}` }
})).json();
console.error(`balance $${bal.data.limit_remaining.toFixed(3)}`);
const r = await fetch('https://openrouter.ai/api/v1/images', {
	method: 'POST',
	headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
	body: JSON.stringify({
		model: 'openai/gpt-image-2',
		aspect_ratio: '9:16',
		quality: 'medium',
		prompt: rest.join(' '),
		input_references: [{ type: 'image_url', image_url: { url: img } }]
	})
});
const j = await r.json();
if (j.error) { console.error('ERR', JSON.stringify(j.error).slice(0, 300)); process.exit(1); }
const d = j.data?.[0];
const b64 = d?.b64_json ?? (d?.url?.startsWith('data:') ? d.url.split(',')[1] : null);
if (!b64) { console.error('no image', JSON.stringify(j).slice(0, 300)); process.exit(1); }
writeFileSync(dest, Buffer.from(b64, 'base64'));
console.log(dest);
