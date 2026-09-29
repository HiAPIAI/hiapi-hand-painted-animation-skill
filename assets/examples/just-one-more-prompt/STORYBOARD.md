# Just One More Prompt: storyboard

Song: `assets/song.mp3` (Suno v6, 146.2 s, 136 BPM, first downbeat 0.464 s; one beat = 0.441 s, one bar = 1.765 s).
Lyrics are acted, never written on screen (bilingual subtitles are added in post, in a band at the bottom 180 px:
**keep the story out of the bottom 160 px of the frame**).

**Logline:** Dev only wanted one prompt, but Clawd and the Enter key are irresistible, so one prompt becomes a whole
night of agents, tokens and green builds, until dawn resets the limit and they press Enter again.

**World:** Dev's room at night: indigo walls, a window of stars, a wooden desk, a monitor that glows green. Each lyric
line gets its own visual pun, but every shot is painted with the same kit and palette (`JP` in `src/lib.js`), and most
return to or rhyme with the desk.
**Colour arc:** cold indigo night (verse 1) → minty screen-green (chorus 1, verse 2) → hot token-orange (chorus 2, 3)
→ blue spotlight (the "blues") → a spinning day/night blur (bridge) → sepia flashback → warm dawn (outro).
**Motifs:**
- **The Enter key** (`enterKey`, `fingerPress`): pressed on "one more prompt" every chorus; glows orange. The last
  shot ends on it.
- **The token jar** (`tokenJar`): fills across the film: 0 (verse 1) → .3 (chorus 1) → .6 (chorus 2) → overflow in
  the window gag → .85 (chorus 3) → 1 + red lid slams on (rate limit, bridge) → at dawn the lid pops off and the jar
  empties (the limit resets) → Enter again.
**Cast:** Clawd (Claude Code), Dev (`dev()` in lib.js, the sleepy developer in a blue hoodie), mini-Clawds as sub-agents
(Clawd at u ≈ 8–12, varied `seed`), Sonnet (Clawd in a beret, `tint: 'rosy'`), Haiku (a tiny Clawd, u ≈ 7, with a
`flower` hat), the Reviewer (an owl-ish grey Clawd with `hat: 'band'`, or Dev-like figure: the worker's choice).
**Dev's arc:** hopeful → nervous → hooked and delighted → overwhelmed → asleep, while Clawd works on → dawn, both awake.
**Clawd's arc:** eager → proud → mischievous → blissed out (blues) → frantic (bridge) → tender (tucks Dev in) → playful.

## Seams between files

Every file boundary is a brush wipe: the outgoing shot calls `brushWipe((lt - (dur - .3)) / .6, COLS)` in its last
0.3 s, the incoming shot calls `brushWipe(.5 + lt / .6, COLS)` in its first 0.3 s, with the SAME colours on both sides.
Inside a file, choose any transition (rule 6), but vary them.

| seam | time | colours |
|---|---|---|
| a → b | 22.20 | `WIPE_GREEN` |
| b → c | 56.80 | `WIPE_TOKEN` |
| c → d | 87.60 | `WIPE_CLAY` |
| d → e | 114.80 | `WIPE_NIGHT` |

## Shots

Times are video time (the lyric lands at the listed time; start actions a beat before so the hit is on the word).

### File a: `src/scenes/a.js` (0 – 22.2) — Verse 1 + Hook 1, cold indigo night
- **A1 0–4.4** "I see green checkmarks glowing in your eyes" (0.9). Iris opens on the dark desk; the monitor fills
  with green ticks one per beat; push in to Clawd on the desk looking at it: the ticks reflect in its eyes (starstruck,
  green `glow`). Dev peeks in from the left edge, amazed. Jar on the desk at 0.
- **A2 4.4–7.6** "Your tool calls make me nervous, they multiply" (4.4). Clawd raises one arm with a wrench; the
  wrench pops into two, four, eight tools orbiting Clawd (hammers, wrenches, screwdrivers). Dev backs up, sweating.
- **A3 7.6–11.3** "There was a sudden drop in my open bugs" (7.6). A pile of red bugs on the desk; Clawd tilts the
  desk / taps it and they slide off the edge and drop out of frame one by one; Dev's jaw drops (surprised).
- **A4 11.3–15.8** "Now I just hit Enter and shrug" (11.3). Close-up of the Enter key; Dev's finger (`fingerPress`)
  comes down, key glows orange; cut to a medium shot: Dev and Clawd shrug in unison-but-offset (arms out), whoosh.
- **A5 15.8–22.2** "Claude, please don't touch main tonight" (16.2 – 21.6). A big old tree in a pot on the desk: the
  "main" trunk, with small branches. Clawd approaches with an axe/saw, mischievous; Dev (pleading, hands together)
  shakes head; Clawd looks at Dev, looks at the trunk, lowers the saw, tiptoes back away, whistling. Wipe out green.

### File b: `src/scenes/b.js` (22.2 – 56.8) — Chorus 1, Verse 2, Hook 2, screen-green
- **B1 22.2–29.7** "Just one more prompt, 'cause the context never stops" (22.4) / "Sub-agents in the room, all
  running at once" (25.6). Dev presses Enter (big hit on 22.4); a paper scroll shoots out of the monitor and unrolls
  across the floor endlessly (camera pans with it); at 25.6 little mini-Clawds pop out of the scroll and scatter,
  running across the room in every direction (varied seeds, no twinning). Jar ticks to .3.
- **B2 29.7–35.9** "Read my stack trace twice with your Opus eyes" (29.7). A tall wobbly tower of stacked blocks (the
  stack trace); Clawd with big opera glasses scans up it, then scans it again (twice), spots one red block, pulls it
  out Jenga-style; the tower wobbles and holds; Clawd proud.
- **B3 35.9–43.4** "We had a calm Friday deploy" (36.1) / "Now the CI's a brand-new toy" (39.6). A paper boat floats
  on a calm sunset pond with Clawd aboard (calm); then a toy train track loops through pipes: Clawd rides the toy train
  through green signal lights, delighted.
- **B4 43.4–50.4** "And you're refactoring, parallelizing" (43.4) / "I feel my codebase reorganizing" (46.9). A messy
  heap of blocks/pages; Clawd conducts with a baton and the pieces fly up and re-sort into a neat grid, in parallel
  waves; Dev behind watches his own desk tidy itself (his mug, papers fly into place).
- **B5 50.4–56.8** "Sonnet, please just fix the tests" (50.4). Dev begs a Clawd in a beret (Sonnet, rosy tint) with a
  quill; a rack of test tubes bubbling red; Sonnet taps each with the quill and each turns green with a tick, in a
  rhythm on the beat. Wipe out token-orange.

### File c: `src/scenes/c.js` (56.8 – 87.6) — Chorus 2, Verse 3, Hook 3, hot token-orange
- **C1 56.8–65.8** "Just one more prompt, watch the green builds bloom" (57.3) / "Tokens to the moon, the weekly
  limit's coming soon" (61.0). Enter press; green flowers bloom across a field in waves; then orange token coins rise
  like a rocket trail to the moon; Dev glances nervously at the jar (now .6).
- **C2 65.8–72.2** "A million tokens in the window" (65.9). A house window stuffed to the brim with coins pressed
  against the glass; Clawd opens the latch; an avalanche of coins pours out over Clawd and Dev.
- **C3 72.2–76.4** "Ship it now, the docs can wait" (72.6) / "CLAUDE.md sets the rules straight" (74.6). Clawd
  smashes a bottle on a little ship's bow, it launches; a pile of docs sulks with a rain cloud. Then Clawd reads a stone
  tablet (the rules) and snaps to attention with a hard hat.
- **C4 76.4–80.0** "Three worktrees at a time, every agent in its own lane" (76.4 / 78.2). Three little trees side by
  side, each with a Clawd in its own running lane, racing in parallel on staggered timings.
- **C5 80.0–83.4** "Esc-Esc, and there you are, rewound to the last good star" (80.0 / 81.8). Clawd trips and makes a
  mess; the image rewinds (motion plays backwards with smear lines) to a clean moment marked by a bright star; Clawd
  relieved.
- **C6 83.4–87.6** "Haiku, please don't let me go" (83.4). Dev dangles from a cliff edge with cherry blossoms; tiny
  Haiku (tiny Clawd with a flower hat) holds Dev's hand with all its might; blossoms fall. Wipe out clay.

### File d: `src/scenes/d.js` (87.6 – 114.8) — Chorus 3 and Bridge
- **D1 87.6–95.8** "Just one more prompt, as the to-do list grows" (87.8) / "Reviewer's on PTO, merge it and go"
  (90.8). Enter press; a to-do list (page with checkboxes) grows taller and taller until it buries Dev; then the
  Reviewer snoozes in a beach chair under an umbrella; Clawd tiptoes past and pushes two streams together (a merge),
  jar at .85.
- **D2 95.8–102.6** "Too late now, I hit approve" (95.8) / "Bypass-permissions blues" (99). A giant tick-stamp slams
  down; then a blue spotlight on stage: Clawd in a fedora plays a saxophone, blissed out, as permission gates (little
  fences) swing open one after another behind it.
- **D3 102.6–108.6** Bridge, fast: "Just skills and hooks all the way" (102.6), "Till the loop runs night and day"
  (104.7), "MCP, a thousand tools" (106.2). Quick cuts on the bar: fishing hooks and badges rain down; Clawd on a
  hamster-wheel loop while the sky flips night/day behind; Clawd opens a toolbox and a fountain of tools erupts.
- **D4 108.6–114.8** "Slash commands rewrite the rules" (108.6), "Background tasks and cron jobs too" (110.4), "Rate
  limit says see you at two" (111.8). Clawd slashes a page in two with a sword; gears and a clock spin in the
  background; then the jar fills to 1 and the red lid SLAMS on; a wall clock points to two; Clawd sits on a bench to
  wait, Dev asleep on the desk. Wipe out night.

### File e: `src/scenes/e.js` (114.8 – 146.2) — Final chorus and Outro
- **E1 114.8–123.0** "Just one more prompt, like the README foretold" (115.0) / "From autocomplete days to agents
  shipping while I'm away" (117 / 120.5). Sepia flashback: a tiny young Clawd placing one letter-block at a time
  (autocomplete); a scroll unrolls like an ancient prophecy. Then back to colour: a fleet of paper boats, each captained
  by a Clawd, sails off while Dev sleeps.
- **E2 123.0–130.6** "What's in the diff? I'll never know" (123.0) / "Did I even read it? No" (126.7). A huge diff
  page (red/green rows) unrolls toward Dev; Dev covers his eyes and presses approve blindly; Clawd turns to camera,
  shrugs.
- **E3 130.6–146.2** Outro "one more… one more… prompt…". Dawn in the room, rhyming with A1: Dev asleep at the desk,
  Clawd tucks a blanket over him. The jar's lid pops off and the coins vanish (the limit reset) with a sparkle. Dev
  wakes, they look at each other, then at the Enter key; both reach for it; on the last "one more" (141.8) they press
  it together, it glows; iris closes on the glowing key; hold on dark until the end (146.2).
