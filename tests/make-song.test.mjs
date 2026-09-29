import assert from 'node:assert/strict';
import test from 'node:test';
import { buildInput, mm3Lyrics } from '../scripts/make-song.mjs';

const opts = { lyrics: '[Intro]\nla\n[Verse 1]\none\n[Pre-Chorus]\ntwo\n[Chorus]\nthree\n[Hook]\nfour', style: 'folk, 95 BPM' };

test('minimax-music-3 gets its own lowercase tags', () => {
  assert.equal(mm3Lyrics(opts.lyrics), '[intro]\nla\n[verse]\none\n[pre-chorus]\ntwo\n[chorus]\nthree\n[chorus]\nfour');
});
test('lyria-3.5 takes bpm as a string and clamps length to 240 s', () => {
  const i = buildInput('lyria-3.5', { ...opts, bpm: 95, seconds: 400 });
  assert.equal(i.bpm, '95'); assert.equal(i.length, 240);
});
test('minimax-music-3 clamps duration to 300 s', () => {
  assert.equal(buildInput('minimax-music-3', { ...opts, seconds: 999 }).duration, 300);
});
test('minimax-music-2.6 enforces its limits', () => {
  assert.throws(() => buildInput('minimax-music-2.6', { ...opts, lyrics: 'x'.repeat(3501) }), /3500/);
  assert.deepEqual(buildInput('minimax-music-2.6', opts), { prompt: opts.style, lyrics: opts.lyrics, audio_format: 'mp3' });
});
test('unknown models are rejected', () => {
  assert.throws(() => buildInput('suno', opts), /unknown music model/);
});
