# 手绘动画短片技能

**对你的编程 Agent 说一个想法，拿回一支手绘动画。**

语言：[English](README.md) | [简体中文](README.zh-CN.md) · AI Agent？先读 [llms-install.md](llms-install.md)。

一个给 Claude Code、Codex 等编程 Agent 用的技能。它会写分镜、用代码逐镜画出来、自己检查画面，最后渲染成 MP4，
全片统一一种画风：水彩笔触、微微抖动的墨线、纸张质感。想要一首歌？它会写好歌词，通过 [HiAPI](https://www.hiapi.ai/zh)
让模型唱出来，再把每一句对齐节拍、配上字幕。

## 用这个技能做的示例

**Made of Everything** · 2:37 —— 一首唱“自己是怎么被做出来的”歌。

https://github.com/user-attachments/assets/c0a859d2-95c3-4aae-8ab6-8f7fd014c293

**Just One More Prompt** · 2:26 —— 和 Claude Code 一起“再来一个 prompt 就睡”的一夜。

https://github.com/user-attachments/assets/17f75db1-cbd7-48ab-84fc-8d7c246716b6

## 安装

```bash
npx -y github:HiAPIAI/hiapi-hand-painted-animation-skill -y
export HIAPI_API_KEY=你的key   # 只有写词作曲才需要：https://www.hiapi.ai/zh/dashboard/api-keys
```

需要 node 18+、ffmpeg、[uv](https://docs.astral.sh/uv/)、git，以及 Google Chrome 或 Chromium。

## 想做什么都可以说

- 「做一支 90 秒的手绘短片：一只守灯塔的猫。」
- 「用一分钟动画讲清楚 CPU 缓存是怎么工作的。」
- 「给团队一周年做一首动画歌曲：indie pop，英文，配中文字幕。」

Agent 会先和你对齐想法，开工前给你看分镜（要做歌的话，付费作曲前先给你看歌词），然后一场一场地画，每场都看检查图，最后把 MP4 交给你。它不会替你发布任何内容。

## 这种画风

每一帧都用 [p5.brush](https://github.com/acamposuribe/p5.brush) 画：平涂和水彩晕染加墨线轮廓，线条每秒重画 12 次，像手绘逐帧动画那样微微抖动，整个画面覆盖纸张纹理，不做 3D，画面里不出现文字。角色会演戏（预备、反应、回弹），所有动作踩在同一个节拍上。引擎和创作指南来自 [ClaudeAnimationBase](https://github.com/JohnHeibel/ClaudeAnimationBase)。

## 关于示例

上面两支视频的分镜和带时间轴的歌词在 [`assets/examples/`](assets/examples/)。
《Just One More Prompt》致敬《I'm Upping My P(doom)》（原词 osmarks，Suno 版 @slimer48484，MV @other__reality），词、曲、画面均为重新创作。

## 许可

MIT。基于 John Heibel 的 ClaudeAnimationBase（MIT）。
