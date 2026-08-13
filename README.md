# hgc — Hogan and Crown Law

A rebuild of `hoganandcrownlaw.com`. SvelteKit on Cloudflare Workers, fully prerendered.

## Run it

```bash
pnpm install
pnpm dev        # local
pnpm build      # prerender every page
pnpm check      # types
pnpm lint       # format and lint
```

## The design concept

The site is built as a case file. Immigration compresses a life into numbered paperwork and
mails it into silence, so the product a client buys is order. The hero is set as a form:
mono field labels, hairline rules, and a serif answer where a date of birth would go. Every
section carries a stamped file reference.

The design system lives in `src/app.css` as Tailwind v4 `@theme` tokens. Do not write raw CSS
values anywhere. Use the tokens.

| Token           | Value     | Role                                           |
| --------------- | --------- | ---------------------------------------------- |
| `--color-ink`   | `#15171b` | Off-black. Body text and dark sections.        |
| `--color-paper` | `#f1f2ee` | Pale security paper. The field.                |
| `--color-seal`  | `#1e4034` | Deep green. The single accent, used sparingly. |
| `--color-field` | `#e6e8e2` | Recessed panels.                               |
| `--color-rule`  | `#cdd0c8` | Hairlines.                                     |
| `--color-muted` | `#5b5f59` | Secondary text.                                |

Type is Newsreader for display, Instrument Sans for body, and IBM Plex Mono for labels and
file references. The fonts are self-hosted in `static/fonts` as latin-subset woff2 with
metric-matched fallbacks, so there is no layout shift on load.

Motion uses one easing curve, `--ease-seal`, applied everywhere. Reveals run through the
`reveal` and `reveal_group` actions in `src/lib/actions.ts`, which use IntersectionObserver
and respect `prefers-reduced-motion`. There is no animation library and no smooth-scroll
hijack.

## Content

All copy lives in two files. Edit these, not the components.

- `src/lib/site.ts` — firm details, phone numbers, address, social links, navigation
- `src/lib/content.ts` — the six practice areas, the answers page, and testimonials

Adding a practice area to `services` creates its page, its sitemap entry, its FAQ schema, and
its links across the site. Nothing else needs to change.

## Marketing

The `marketing/` directory holds work that is separate from the code:

- `video-scripts.md` — 30 short-form scripts for TikTok, Reels, and Shorts
- `directory-profiles.md` — paste-ready copy for Google Business Profile, Avvo, Justia, Yelp,
  and LinkedIn
- `review-requests.md` — templates for asking clients for Google reviews

## Before this goes live

1. Confirm the WhatsApp number. `site.whatsapp` is currently set to the direct line,
   `14692881606`. If WhatsApp runs on a different number, change it.
2. Point `site.booking` at the real scheduling link. It currently points at the old
   `/appointment` page.
3. Replace the single placeholder testimonial in `content.ts` with real, attributed reviews.
   Do not invent any.
4. Confirm Queenette Hogan's pronouns. The copy avoids pronouns throughout, which reads
   slightly formal. Once confirmed, the About and home copy can be relaxed.
5. Confirm the Texas bar position. The site states that the practice is federal immigration
   law and does not advise on Texas state law. Correct that if it is wrong.
6. Add real photographs. The site carries no images at all, which is deliberate and works, but
   one good portrait on the About page would raise trust.

## Deploy

```bash
pnpm build
pnpm dlx wrangler deploy
```

The adapter writes to `.svelte-kit/cloudflare`. Every page prerenders, so the worker only
serves static assets. There are no secrets and no server routes.
