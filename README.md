# DEVO-AI-OS v2.0

DEVO-AI-OS v2.0 integrates **OneMind Engine** as the top-level creative workflow planner.

## Core Formula

```text
Complex Knowledge → Story → Image → Experience → Change
```

## New in v2.0

- ONEMIND_ENGINE
- `/api/onemind`
- OneMind-powered Router
- OneMind-powered Canva Design Agent
- v2.0 Admin Panel
- MCP tool: `devo_onemind`

## API Endpoints

```text
/api/onemind
/api/openai
/api/router
/api/workflows
/api/engines
/api/canva
/api/github
/api/mcp
/api/memory
/api/health
/admin
```

## Test

```bash
curl https://devo-ai-os.vercel.app/api/health
```

```bash
curl -X POST https://devo-ai-os.vercel.app/api/onemind \
-H "Content-Type: application/json" \
-d '{"input":"AI와 인간의 미래"}'
```

## Deploy

Upload this project to GitHub and deploy with Vercel.
