# REPOSITORY_SPLIT_GUIDE

## Recommended Repositories

Create the following repositories under `rameau65`:

```text
onemind
onemind-project
onemind-mind-scenes
```

## Step 1 — Create Repositories

In GitHub:

1. Click New Repository.
2. Create `onemind`.
3. Create `onemind-project`.
4. Create `onemind-mind-scenes`.

## Step 2 — Copy Distribution Files

### onemind
Copy:

```text
distributions/DEVO-AI-OS/*
core/
engines/
workflows/
templates/
agents/
skills/
docs/MULTI_AI_DEPLOYMENT.md
```

### onemind-project
Copy:

```text
distributions/DEVO-AI-OS-HANMAUM/*
core/
world_bible/HANMAUM_LAYER.md
engines/STORY_ENGINE.md
engines/MEDITATION_ENGINE.md
engines/INFOGRAPHIC_ENGINE.md
engines/SCRIPT_ENGINE.md
engines/QUALITY_ENGINE.md
workflows/MEDITATION_PIPELINE.md
workflows/DOCUMENTARY_PIPELINE.md
templates/
```

### onemind-mind-scenes
Copy:

```text
distributions/DEVO-AI-OS-MIND-SCENES/*
core/
world_bible/MIND_SCENES_LAYER.md
engines/STORY_ENGINE.md
engines/VISUAL_ENGINE.md
engines/VIDEO_ENGINE.md
engines/MUSIC_ENGINE.md
engines/MEDITATION_ENGINE.md
engines/CHANNEL_ENGINE.md
workflows/MEDITATION_PIPELINE.md
workflows/YOUTUBE_PIPELINE.md
templates/
```

## Step 3 — Version Tags

Use these tags:

```text
onemind-v6.0-core
onemind-v6.0-project
onemind-v6.0-mind-scenes
```

## Current Status
Because this connector can update existing repositories but cannot create new repositories, the split packages are staged inside the current `SKILL` repository under `/distributions`.
