"""align.py: listen to the song, find the beat, and time every lyric line.
Usage: uv run --with faster-whisper --with librosa python scripts/align.py song/song.mp3 [song/lyrics.txt] [--model=small]
Writes <audio>.align.json (tempo, first beat, beats, whisper words) and, when lyrics are given, <audio>.lines.tsv:
start<TAB>end<TAB>lyric line<TAB>(translation: fill in). Prints the transcript and a lyric match score so you can
pick the best take: a take that skipped or mangled lines scores low."""
import difflib, json, re, sys
from pathlib import Path

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opts = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
if not args: sys.exit(__doc__)
audio = Path(args[0]); lyrics = Path(args[1]) if len(args) > 1 else None

import librosa, numpy as np
from faster_whisper import WhisperModel

y, sr = librosa.load(str(audio), sr=22050, mono=True)
tempo, beats = librosa.beat.beat_track(y=y, sr=sr)
beat_t = librosa.frames_to_time(beats, sr=sr).tolist()
tempo = float(np.atleast_1d(tempo)[0])
dur = float(len(y) / sr)

model = WhisperModel(opts.get('model', 'small'), device='cpu', compute_type='int8')
segs, _ = model.transcribe(str(audio), language=opts.get('lang', 'en'), word_timestamps=True)
words = []
for s in segs:
    print(f'[{s.start:6.1f}-{s.end:6.1f}] {s.text.strip()}')
    words += [{'w': w.word.strip(), 's': round(w.start, 2), 'e': round(w.end, 2)} for w in s.words]
json.dump({'duration': dur, 'tempo': tempo, 'offset': beat_t[0] if beat_t else 0, 'beats': beat_t, 'words': words},
          open(f'{audio}.align.json', 'w'), indent=1)
print(f'\nduration {dur:.1f}s  tempo {tempo:.1f} BPM  first beat {beat_t[0] if beat_t else 0:.3f}s  → {audio}.align.json')

if lyrics:
    norm = lambda s: re.sub(r"[^a-z0-9']", '', s.lower())
    lines = [l.strip() for l in lyrics.read_text(encoding='utf-8').splitlines() if l.strip() and not re.fullmatch(r'\[.*\]', l.strip())]
    lw, owner = [], []
    for i, l in enumerate(lines):
        for w in l.split():
            if norm(w): lw.append(norm(w)); owner.append(i)
    hw = [norm(w['w']) for w in words]
    sm = difflib.SequenceMatcher(None, lw, hw, autojunk=False)
    hit = {}
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): hit.setdefault(owner[a + k], []).append(words[b + k])
    rows, missing = [], []
    for i, l in enumerate(lines):
        ws = hit.get(i)
        if not ws: missing.append(l); continue
        rows.append((ws[0]['s'], ws[-1]['e'] + .3, l))
    for k in range(len(rows) - 1):   # never overlap the next line
        if rows[k][1] > rows[k + 1][0]: rows[k] = (rows[k][0], rows[k + 1][0] - .05, rows[k][2])
    out = Path(f'{audio}.lines.tsv')
    out.write_text(''.join(f'{a:.2f}\t{b:.2f}\t{l}\t\n' for a, b, l in rows), encoding='utf-8')
    print(f'lyric match {sm.ratio():.0%} of words  ·  {len(rows)}/{len(lines)} lines timed  → {out}')
    for l in missing: print('  not heard:', l)
