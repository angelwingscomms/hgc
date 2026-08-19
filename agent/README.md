# hgc-agent

Drafts one Hogan and Crown episode a day and queues it for a human. It does not post on its own.

Live at `https://hgc-agent.apexlinks.workers.dev`. Every operator route needs `?t=<REVIEW_TOKEN>`.

| route | does |
| --- | --- |
| `/review` | the pictures, the caption, approve and reject buttons |
| `/draft` | draft now instead of waiting for the schedule |
| `/status` | current episode, facts used, recent log |
| `/approve` | post the current episode to TikTok and X |
| `/reject?why=…` | bin it and log why |
| `/arm?cron=0 9 * * *` | set the daily schedule |
| `/disarm` | stop the schedule |
| `/media/<key>` | public R2 passthrough, no auth, because TikTok pulls images from it |

## Why it does not post by itself

These are legal claims published under a named attorney, and attorney advertising is regulated.
Every episode built by hand so far needed a human to change something, including one where a true
sentence was one word away from a false one. So the schedule drafts and stops.

Flip that only when the output has been right unattended for a couple of weeks.

## Why carousels and not video

Workers cannot run ffmpeg. The video pipeline needs ffmpeg and chromium, so it stays on the local
machine at `../marketing/still`. The agent posts the same stills as a photo carousel, which is a
first-class format on both platforms and needs nothing but `fetch`.

A Cloudflare Container could run the full render, at the cost of Workers Paid, an image build, and
encoding on half a vCPU. Not worth it until the carousels prove the content works.

## Scheduling

The daily run is a durable object alarm, not a Worker cron trigger. The account is on the free plan
and already holds its five cron triggers. Alarms are not capped that way.

## Credential gates

| secret | state | note |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | set | image generation and the beat writer |
| `REVIEW_TOKEN` | set | in `~/.hgc-review-token` |
| `PUBLIC_BASE` | set | the worker's own origin, TikTok pulls images from it |
| `TIKTOK_ACCESS_TOKEN` | **missing** | see below |
| `TIKTOK_PUBLIC` | unset | leave unset until the audit passes |
| `X_API_KEY` `X_API_SECRET` `X_ACCESS_TOKEN` `X_ACCESS_SECRET` | **missing** | OAuth 1.0a user context, app-only tokens cannot upload media |

### TikTok is gated for weeks, not hours

The Content Posting API needs a second audit on top of developer signup. Until it passes, every
direct post is forced to `SELF_ONLY` and only the connected account can see it. The audit runs two
to four weeks and usually takes several rounds.

So: register the app, connect the account, and let it post `SELF_ONLY` while the audit is pending.
Set `TIKTOK_PUBLIC=true` only once the audit clears.

## Facts

`src/facts.ts`. Eight open facts, each with the narrow version of the claim, because overstating a
true immigration fact is how it becomes a false one. Nothing goes in this file without a source on
the firm's own answers page.

When the bank empties the agent logs and stops rather than inventing anything.

## Known gap

The look drifts from the hand-built episodes. The draft model here is
`black-forest-labs/flux.2-klein-4b` against a single style reference, and it comes back brighter
and more cartoon than the local pipeline. Tune the `LOOK` block in `src/generate.ts` and the
reference in R2 at `static/style-ref.png` before turning anything public.
