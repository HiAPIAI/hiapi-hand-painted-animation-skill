#!/usr/bin/env node
// write-lyrics.mjs: a song brief → singable lyrics with section tags + a style prompt, written by Claude through HiAPI.
//   node scripts/write-lyrics.mjs --brief=brief.md --out=song [--model=claude-opus-5-5]
// Writes song/lyrics.txt, song/style.txt and song/lyrics.call.json (model, message id, token usage: keep it as evidence
// if you want to say "lyrics written by Claude through HiAPI").
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { flags, messages } from './hiapi.mjs';

const f = flags();
if (!f.brief) { console.error('usage: write-lyrics.mjs --brief=brief.md --out=song [--model=claude-opus-5-5]'); process.exit(1); }
const out = f.out || 'song'; mkdirSync(out, { recursive: true });
const SYSTEM = `You are a songwriter writing lyrics that an AI music model will sing. Output only what is asked, no commentary.
Rules:
- Singable, simple words; strong open vowels on long notes; concrete images; short lines (4-9 words).
- Section tags on their own lines, nothing else on a tag line: [Intro] [Verse 1] [Verse 2] [Verse 3] [Pre-Chorus] [Chorus] [Bridge] [Outro].
- Repeat the chorus core at least twice; vary the final chorus. 28-40 sung lines for about 2:30.
- Every line must be something a picture can ACT (an object, a gesture, a place): it will become an animated shot.
- Do not name brands or products in the lyrics unless the brief explicitly asks for it.
After the lyrics, write a line containing only ===STYLE=== and then one style prompt (max 60 words) for a music model:
genre, instruments, vocal type, mood arc, and the BPM.`;
const { text, meta } = await messages({ model: f.model || 'claude-opus-5-5', system: SYSTEM, user: readFileSync(f.brief, 'utf8') });
const [lyrics, style = ''] = text.split('===STYLE===');
writeFileSync(join(out, 'lyrics.txt'), lyrics.trim() + '\n');
writeFileSync(join(out, 'style.txt'), style.trim() + '\n');
writeFileSync(join(out, 'lyrics.call.json'), JSON.stringify(meta, null, 1));
console.log(text.trim());
console.log(`\nwrote ${out}/lyrics.txt, style.txt, lyrics.call.json  (${meta.model}, ${meta.id})`);
if (!style.trim()) console.warn('warning: no ===STYLE=== section came back; write style.txt yourself');
