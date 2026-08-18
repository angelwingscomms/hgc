# things we wish you knew

A series of nine second videos. Same diner, same two friends, one fact per episode, and something
different goes wrong behind them every time.

The background disaster is the reason anyone watches a second one.

## What never changes

`style.json` holds it: the painterly look, the diner, the two friends, the locked camera with a
slow push, the burned caption treatment, and the end card. Do not edit it per episode. The set is
the brand.

Six of the seven visual components are held constant: flat warm amber, horizontal lines,
rectangles, low key with the faces brightest, still bodies, slow regular rhythm. One component
spikes, once, on the punchline. That is the whole visual plan.

## What changes per episode

`<name>.json` holds four things:

- `frame` — the opening still, which must show motion already happening
- `shot` — the dialogue and the background disaster
- `audio` — what it sounds like
- `captions` — the claim, burned in, readable with the sound off

## The five beats

| Beat | Time | Job |
| --- | --- | --- |
| claim | 0.0 - 1.5s | he drops into the seat and states the fact. no greeting, no setup |
| question | 1.5 - 3.0s | she asks the one question the viewer is asking |
| turn | 3.0 - 5.5s | the answer, in one line |
| break | 5.5 - 7.0s | the disaster behind them lands on the last word of the answer |
| drip | 7.0 - 9.0s | the aftermath, ignored by both. end card over it |

Rules:

- Around 15 spoken words. Not 24. Leave air for the gag.
- The claim is the first thing said and the first thing on screen.
- The disaster must be **set up in the opening frame**, so it is fair. Rain visible through the
  glass before the door opens.
- The disaster lands on the same word as the fact, never after it. Both readings must arrive
  together or it is two events instead of one joke.
- Neither friend reacts to the disaster except for her one head turn, which reads as surprise at
  the fact and surprise at the noise at the same time. That double reading is the joke.
- The disaster must relate to the fact. A joke that has nothing to do with the message means
  people keep the joke and forget the firm.

## Facts, all from the site

Each one is already published at `hoganandcrown.apexlinks.org`. Do not invent a legal claim.

| # | Fact | Disaster that rhymes with it |
| --- | --- | --- |
| 1 | leaving triggers the bar, not the overstay | a man steps out of the door and is instantly soaked |
| 2 | a notary is not a lawyer, ask for the bar number | someone at the counter is confidently repairing the wrong machine |
| 3 | the government never phones asking for payment | a phone rings and rings behind the counter, nobody answers it, it is unplugged |
| 4 | the diversity lottery is free to enter | a man pays the vending machine three times for a thing already on the floor |
| 5 | you need not open the door without a judge's warrant | someone knocks on the window instead of the door, then keeps knocking |
| 6 | leaving with a pending case and no advance parole abandons it | a man leaves his coat, comes back, the seat is taken |
| 7 | you must report a change of address | letters keep coming through the door and piling up under it |
| 8 | a bigger bank balance does not fix a 214(b) | a man keeps feeding notes into a jukebox that is not playing |

Column three is a first pass, not settled. Test each one against the rule above before you build it.

## Making one

```bash
export OPENROUTER_API_KEY=...
node vid.mjs cost  <name>.json    # tokens and balance, free
node vid.mjs key   <name>.json    # keyframe, about 7 cents. iterate here
node vid.mjs gen   <name>.json    # render, about 0.68 at 9s 720p
node vid.mjs burn  <name>.json    # captions and end card, free
```

Everything lands in `out/`. Iterate on the keyframe until the two faces are the brightest thing in
the frame, then render once.

## Uploading

Upload in the app, not the web uploader. Add a trending sound. Put one search shaped sentence in
the description, because this niche is searched and not only browsed. The burned captions carry
the fact, so it works muted, which is how most of the room watches.
