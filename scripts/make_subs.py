"""make_subs.py: burn two-line lyric subtitles (lyric over translation) into a video, as PNG overlays (works on any
ffmpeg build, no libass needed). The top line is yellow, the bottom white, on a dark rounded band at the bottom centre.
Usage: uv run --with pillow python scripts/make_subs.py <in.mp4> <out.mp4> <lines.tsv> [--font=/path/font.ttc]
lines.tsv: start<TAB>end<TAB>line<TAB>translation (translation may be empty: then one line)."""
import os, subprocess, sys, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

args = [a for a in sys.argv[1:] if not a.startswith('--')]
opts = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)
if len(args) < 3: sys.exit(__doc__)
src, dst, tsv = args
CANDIDATES = [opts.get('font'), os.environ.get('SUBS_FONT'), '/System/Library/Fonts/Hiragino Sans GB.ttc', '/System/Library/Fonts/PingFang.ttc',
              '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc', '/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc', 'C:/Windows/Fonts/msyh.ttc']
FONT = next((f for f in CANDIDATES if f and Path(f).exists()), None)
if not FONT: sys.exit('no CJK-capable font found: pass --font=/path/to/font.ttc or set SUBS_FONT')
def font(size, index):
    try: return ImageFont.truetype(FONT, size, index=index)
    except OSError: return ImageFont.truetype(FONT, size)
top_f, bot_f = font(46, 1), font(38, 0)
YELLOW, WHITE, BAND = (245, 200, 72, 255), (245, 245, 245, 255), (51, 42, 72, 225)

tmp = Path(tempfile.mkdtemp(prefix='subs_'))
events = []
for i, row in enumerate(r for r in Path(tsv).read_text(encoding='utf-8').splitlines() if r.strip()):
    a, b, top, *rest = row.split('\t'); bot = rest[0].strip() if rest else ''
    probe = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    w = max(probe.textlength(top, font=top_f), probe.textlength(bot, font=bot_f) if bot else 0) + 80
    h = 130 if bot else 76
    img = Image.new('RGBA', (int(w), h), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, img.width - 1, h - 1], radius=26, fill=BAND)
    d.text((img.width / 2, 40 if bot else h / 2), top, font=top_f, fill=YELLOW, anchor='mm')
    if bot: d.text((img.width / 2, 94), bot, font=bot_f, fill=WHITE, anchor='mm')
    p = tmp / f'{i:03d}.png'; img.save(p); events.append((float(a), float(b), p, img.width, h))

inputs, chain, last = ['-i', src], [], '0:v'
for k, (a, b, p, w, h) in enumerate(events):
    inputs += ['-i', str(p)]
    chain.append(f"[{last}][{k + 1}:v]overlay=x=(W-{w})/2:y=H-{h + 40}:enable='between(t,{a},{b})'[v{k}]")
    last = f'v{k}'
cmd = ['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(chain) or 'null', '-map', f'[{last}]', '-map', '0:a?',
       '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', dst]
subprocess.run(cmd, check=True)
print('wrote', dst, len(events), 'subtitle lines')
