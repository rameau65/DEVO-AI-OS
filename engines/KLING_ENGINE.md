# KLING_ENGINE

## Purpose
Create cinematic AI videos with strong motion control, character continuity, dynamic camera language, and image-to-video refinement.

Optimized for:
- Character animation
- Dramatic motion shots
- Cinematic image-to-video
- Short narrative scenes
- Social video loops
- Stylized action moments

## Input
- Text prompt
- Reference image
- Character description
- Motion goal
- Camera direction
- Duration
- Aspect ratio
- Style reference

## Output
- Kling prompt
- Motion plan
- Camera plan
- Character consistency notes
- Negative prompt
- Loop / short-form variant
- Quality checklist

## Recommended Workflow

```text
STORY_ENGINE
→ VISUAL_ENGINE
→ KLING_ENGINE
→ QUALITY_ENGINE
```

For music-driven scenes:

```text
STORY_ENGINE
→ VISUAL_ENGINE
→ KLING_ENGINE
→ MUSIC_ENGINE
→ CHANNEL_ENGINE
```

## Prompt Formula
Subject + Action + Environment + Camera Movement + Lighting + Style + Mood + Motion Constraints + Negative Constraints

## Motion Vocabulary
- Controlled walk cycle
- Wind-blown fabric
- Hair movement
- Slow turn
- Eye blink
- Subtle expression shift
- Object floating
- Water ripple
- Light sweep
- Dynamic tracking
- Cinematic dolly

## Base Prompt
Animate this reference image into a cinematic video while preserving the character identity, clothing, facial structure, composition, and color palette. Add controlled natural motion, smooth camera movement, film-grade lighting, and emotional continuity. Avoid face distortion, hand artifacts, excessive movement, identity drift, sudden cuts, or style inconsistency.

## Best Use Cases
- When character identity matters
- When stronger motion is needed than Hailuo
- When creating short emotional or action loops
- When testing cinematic scene movement

## Default Rules
- Protect face and hands first.
- Keep motion readable.
- Do not over-animate static portraits.
- Use clear camera verbs.
- Add negative constraints every time.
