# Models used through HiAPI

All are called on `https://api.hiapi.ai`. Check live prices at https://www.hiapi.ai/en/pricing before quoting a cost.

## Lyrics (text): `POST /v1/messages` (Anthropic format)
`claude-opus-5-5` by default (`--model=` to change). One call ≈ 600 input + 1.5k output tokens.

## Songs (music): `POST /v1/tasks`, then `GET /v1/tasks/{taskId}` until `success | fail`; audio at `data.output[].url`

| model | listed price (2026-09) | lyrics | control | notes from the reference film |
|---|---|---|---|---|
| `minimax-music-2.6` | $0.21 / song | optional, ≤ 3500 chars, 14 section tags | prompt ≤ 2000 chars, format/bitrate | **chosen**: every line sung as written, 157 s, 95.7 BPM measured for a 95 BPM brief, ~2 min |
| `lyria-3.5` | $0.09 / song | optional, basic tags | `bpm` (string), `length` 1–240 s, `title`, `seed` | 159 s, ~1 min, m4a |
| `minimax-music-3` | billed per requested second | required; lowercase tags only (make-song.mjs converts) | `duration` 1–300 s, `seed` | lossless WAV |
| `minimax-music-1.5` | $0.07 / song | required | format/bitrate | cheapest draft |

`lyria-3-pro` takes no lyrics (instrumental/auto): not for lyric videos.
Voice-overs or dialogue (not songs): `qwen-audio-3.0-tts-plus`, `elevenlabs/text-to-dialogue`.
