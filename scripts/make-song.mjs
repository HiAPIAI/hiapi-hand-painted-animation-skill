#!/usr/bin/env node
// make-song.mjs: lyrics + style → a full song through HiAPI's music models. Several models run in parallel for an A/B.
//   node scripts/make-song.mjs --lyrics=song/lyrics.txt --style=song/style.txt --out=song \
//        [--models=minimax-music-2.6,lyria-3.5] [--bpm=95] [--seconds=160] [--title="..."] [--seed=7] [--dry-run]
// For each model: <out>/<tag>.request.json, <tag>.task.json and <tag>-0.<ext> (the audio). Output links expire (~7 days).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { download, flags, pollTask, submitTask } from './hiapi.mjs';

export const MODELS = {
  'minimax-music-2.6': { tag: 'mm26', note: 'natural vocals, 14 section tags, lyrics ≤ 3500 chars, billed per song' },
  'minimax-music-3': { tag: 'mm3', note: 'lossless WAV, duration 1–300 s (billed per requested second), lowercase tags' },
  'minimax-music-1.5': { tag: 'mm15', note: 'cheapest, lyrics required' },
  'lyria-3.5': { tag: 'lyria35', note: 'bpm + length (1–240 s) guidance, basic tags' },
};
const MM3_TAGS = ['intro', 'verse', 'pre-chorus', 'chorus', 'post-chorus', 'bridge', 'instrumental', 'solo', 'outro'];
// minimax-music-3 drops text on a tag line and only knows its own lowercase tags: [Verse 2] → [verse], [Hook] → [chorus]
export function mm3Lyrics(lyrics) {
  return lyrics.split('\n').map(l => {
    const m = l.trim().match(/^\[([^\]]+)\]$/); if (!m) return l;
    const t = m[1].toLowerCase().replace(/\s*\d+$/, '').replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
    const hit = MM3_TAGS.find(x => t === x) || (t.includes('pre') ? 'pre-chorus' : t.includes('hook') || t.includes('chorus') ? 'chorus' : t.includes('intro') ? 'intro' : t.includes('outro') ? 'outro' : t.includes('bridge') ? 'bridge' : 'verse');
    return `[${hit}]`;
  }).join('\n');
}
export function buildInput(model, { lyrics, style, bpm, seconds, title, seed }) {
  if (!style) throw new Error('a style prompt is required');
  if (model === 'minimax-music-2.6') {
    if (style.length > 2000) throw new Error('minimax-music-2.6: prompt is limited to 2000 characters');
    if (lyrics.length > 3500) throw new Error('minimax-music-2.6: lyrics are limited to 3500 characters');
    return { prompt: style, lyrics, audio_format: 'mp3' };
  }
  if (model === 'minimax-music-3') return { prompt: style, lyrics: mm3Lyrics(lyrics), duration: Math.min(300, Math.max(1, Math.round(seconds || 170))), ...(seed != null ? { seed: +seed } : {}) };
  if (model === 'minimax-music-1.5') return { prompt: style, lyrics, audio_format: 'mp3' };
  if (model === 'lyria-3.5') return { prompt: style, lyrics, ...(title ? { title } : {}), ...(bpm ? { bpm: String(bpm) } : {}), length: Math.min(240, Math.max(1, Math.round(seconds || 160))), ...(seed != null ? { seed: String(seed) } : {}) };
  throw new Error(`unknown music model ${model}; one of ${Object.keys(MODELS).join(', ')}`);
}

async function one(model, opts, out, dry) {
  const tag = MODELS[model].tag, input = buildInput(model, opts);
  writeFileSync(join(out, `${tag}.request.json`), JSON.stringify({ model, input }, null, 1));
  if (dry) { console.log(`[dry-run] ${model}: ${join(out, tag + '.request.json')}`); return; }
  const id = await submitTask(model, input);
  console.log(`${model}: task ${id}`);
  const d = await pollTask(id, { onStatus: s => console.log(`${model}: ${s}`) });
  writeFileSync(join(out, `${tag}.task.json`), JSON.stringify(d, null, 1));
  if (d.status !== 'success') { console.error(`${model}: FAILED ${JSON.stringify(d.error || d).slice(0, 400)}`); return; }
  let i = 0;
  for (const o of d.output || []) {
    if (!o.url) continue;
    const ext = (o.url.split('?')[0].split('.').pop() || 'mp3').slice(0, 4), file = join(out, `${tag}-${i++}.${ext}`);
    await download(o.url, file); console.log(`${model}: saved ${file}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const f = flags();
  if (!f.lyrics || !f.style) { console.error('usage: make-song.mjs --lyrics=lyrics.txt --style=style.txt --out=song [--models=a,b] [--bpm] [--seconds] [--title] [--seed] [--dry-run]'); process.exit(1); }
  const out = f.out || 'song'; mkdirSync(out, { recursive: true });
  const opts = { lyrics: readFileSync(f.lyrics, 'utf8').trim(), style: readFileSync(f.style, 'utf8').trim(), bpm: f.bpm, seconds: f.seconds && +f.seconds, title: f.title, seed: f.seed };
  const models = String(f.models || 'minimax-music-2.6').split(',').map(s => s.trim()).filter(Boolean);
  const res = await Promise.allSettled(models.map(m => one(m, opts, out, f['dry-run'])));
  res.forEach((r, i) => r.status === 'rejected' && console.error(`${models[i]}: ${r.reason.message}`));
  process.exit(res.some(r => r.status === 'rejected') ? 1 : 0);
}
