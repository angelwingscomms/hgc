import type { Fact } from './facts';

// The house look, kept identical to ~/i/hgc/marketing/video/style.json. Changing it here without
// changing it there means the agent's episodes stop matching the ones made by hand.
const LOOK = `THIS IS A SINGLE FRAME FROM A PAINTED 3D ANIMATED FEATURE FILM. it is not a photograph, not live action, and not an oil painting on canvas. it is animation. every surface is built from flat simplified planes of painted colour with soft painted edges. there is no photographic surface texture, no volumetric light shafts, no realistic depth of field, no render sheen and no specular highlights. light falls as broad flat painted shapes.

skin is smooth and matte with soft simplified planes and no outlines anywhere, faces defined by shaped shadow and by light. environments are painted rather than rendered, with heavy atmospheric haze on the far planes. the signature is the light: a strong coloured rim separating the subject from a much darker ground, extreme low key with large areas of near black, and two opposed hues in every frame, a cool teal green ground against a warm amber key. fine film grain, soft bloom around every light source.

palette: cold teal green ground against a warm amber key. no magenta, no pink, no purple.`;

export type Card = { line: string; scene: string; text_in: string; surface: string };

type Env = { OPENROUTER_API_KEY: string; DRAFT_MODEL: string; PROD_MODEL: string; WRITER_MODEL: string };

async function or_json(env: Env, path: string, body: unknown) {
	const r = await fetch(`https://openrouter.ai/api/v1${path}`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	const j = (await r.json()) as any;
	if (j.error) throw new Error(`${path}: ${JSON.stringify(j.error).slice(0, 300)}`);
	return j;
}

// Four beats as one indignant argument. The model writes the scenes; the guardrails are not
// negotiable and are repeated here rather than trusted to the model's memory.
export async function write_cards(env: Env, fact: Fact): Promise<Card[]> {
	const j = await or_json(env, '/chat/completions', {
		model: env.WRITER_MODEL,
		messages: [
			{
				role: 'user',
				content: `Write four cards for a fifteen second vertical fact video for a US immigration law firm.

THE FACT: ${fact.claim}
DETAIL: ${fact.detail}
STAY NARROW: ${fact.careful}

Rules, all of them binding:
- Four cards. Each has one sentence of six to ten words, lowercase.
- The mode is INDIGNATION on the viewer's behalf, never sadness and never scolding. Give the sentence an antagonist: "they never told you", not "nobody told you".
- Aim at the process. Never name a party, an agency, an administration, or an officer.
- Never invent a number, a deadline, or an eligibility rule. Never promise an outcome.
- The last card exonerates the viewer and points forward. Never blame their family or their community.
- Each card is a real scene with a person in it, in a dark interior, lit by one warm source against a cold teal room.
- Each card names a DIFFERENT physical surface the words are cut into: door paint, floorboards, a windowsill, a tabletop, plaster, a doorframe, concrete.

Return ONLY a JSON array of four objects, each with:
  line     - the sentence
  scene    - the painted scene, two or three sentences, a person clearly visible and lit
  surface  - the surface the words are cut into, a short phrase
  text_in  - how the words are carved into that surface: cut through a layer into what is beneath, shadow inside every groove and a lit edge along one side, crude and uneven with chipped edges and torn grain`
			}
		]
	});
	const text: string = j.choices?.[0]?.message?.content ?? '';
	const m = text.match(/\[[\s\S]*\]/);
	if (!m) throw new Error('writer returned no json');
	return JSON.parse(m[0]) as Card[];
}

// Two passes, exactly as the hand pipeline does it. The cheap model paints the scene with the
// words already worked into the material, badly spelled. The strong model then redraws only the
// lettering. Handing the strong model a blank surface makes it lay flat captions on top instead.
export async function render_card(env: Env, card: Card, styleRef: string | null): Promise<Uint8Array> {
	const refs = styleRef ? [{ type: 'image_url', image_url: { url: styleRef } }] : [];

	const base = await or_json(env, '/images', {
		model: env.DRAFT_MODEL,
		aspect_ratio: '9:16',
		resolution: '1K',
		input_references: refs,
		prompt: `${LOOK}

${card.scene}

the words "${card.line}" are cut into ${card.surface}, never printed on top. ${card.text_in}. the lettering is large, plain, lowercase, on two lines, well inside the frame. nothing else in the picture carries any writing.

vertical 9:16. no watermark, no logo, no caption bar, no border.`
	});
	const b64base = pick(base);

	const fixed = await or_json(env, '/images', {
		model: env.PROD_MODEL,
		aspect_ratio: '9:16',
		quality: 'medium',
		input_references: [{ type: 'image_url', image_url: { url: `data:image/png;base64,${b64base}` } }],
		prompt: `the writing on ${card.surface} in this painting is misspelled nonsense. erase it completely and redraw it from scratch, spelled correctly, reading exactly these words and nothing else: "${card.line}". keep it the same size and in the same place, on two lines, plain lowercase, cut into the material with real depth. everything else stays exactly as it is: same colours, same light, same composition, every object where it is. above all keep it a flat painted animation frame. do not repaint any surface realistically, do not add photographic texture or render sheen. the only thing you change is the lettering.`
	});
	return b64_to_bytes(pick(fixed));
}

function pick(j: any): string {
	const d = j.data?.[0];
	const b64 = d?.b64_json ?? (d?.url?.startsWith('data:') ? d.url.split(',')[1] : null);
	if (!b64) throw new Error(`no image: ${JSON.stringify(j).slice(0, 200)}`);
	return b64;
}

function b64_to_bytes(b64: string): Uint8Array {
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}
