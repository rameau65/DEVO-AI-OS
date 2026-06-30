# FLOW_ENGINE

## Purpose
Design and manage end-to-end AI production workflows across story, image, video, music, editing, publishing, and archive.

FLOW_ENGINE is not just a video-generation engine. It is the production orchestration layer that connects tools and outputs into one repeatable pipeline.

Optimized for:
- Multi-tool AI production
- YouTube content pipeline
- Meditation film production
- Documentary production
- Prompt-to-delivery workflow
- Team handoff
- Project archive

## Input
- Project goal
- Output format
- Target platform
- Available tools
- Source materials
- Deadline or production scale
- Quality target

## Output
- Full production workflow
- Tool routing map
- Task checklist
- File naming system
- Prompt chain
- Review checkpoints
- Delivery package
- Archive structure

## Recommended Workflow

```text
CORE
→ STORY_ENGINE
→ VISUAL_ENGINE
→ SEEDANCE_ENGINE / KLING_ENGINE / HAILUO_ENGINE / GROK_VIDEO_ENGINE
→ MUSIC_ENGINE
→ INFOGRAPHIC_ENGINE / CHANNEL_ENGINE
→ QUALITY_ENGINE
→ PROMPT_LIBRARY_ENGINE
```

## Flow Map Template

| Stage | Goal | Tool | Input | Output | Review Point |
|---|---|---|---|---|---|
| 1 | Concept | ChatGPT / Claude | Topic | Core message | Clarity |
| 2 | Story | STORY_ENGINE | Core message | Storyboard | Narrative |
| 3 | Visual | VISUAL_ENGINE | Storyboard | Image prompts | Style |
| 4 | Video | SEEDANCE/KLING/HAILUO/GROK | Images | Video shots | Motion |
| 5 | Music | MUSIC_ENGINE | Mood | Suno prompt | Emotional fit |
| 6 | Package | CHANNEL_ENGINE | Final assets | Upload package | Distribution |

## File Naming Rule

```text
PROJECT_SCENE_TOOL_VERSION_DATE
```

Example:

```text
mind-scenes_s01e01_seedance_v03_20260622.mp4
```

## Review Gates

1. Concept Gate
2. Story Gate
3. Visual Gate
4. Motion Gate
5. Sound Gate
6. Final Package Gate

## Default Rules
- One project, one workflow map.
- Every generated prompt should be archived.
- Every tool output should have a review checkpoint.
- Use the simplest tool that can achieve the intended result.
- Do not let tool novelty override the core message.
