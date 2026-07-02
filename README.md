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
- Canva Connect API live design creation
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

## Canva One-Command Workflow

Goal:

```text
One command → OneMind design brief → Canva project creation → Editable Canva design URL
```

### 1. Create a Canva integration

Go to the Canva Developer Portal and create an integration.

Required setup:

```text
Canva account MFA: enabled
Integration type: Public or Private
Scopes: design:content Read/Write, design:meta Read, asset Read/Write when needed
Redirect URL: your deployed callback URL if OAuth callback is implemented
```

### 2. Add Vercel environment variable

After authorizing Canva OAuth and obtaining a valid access token, add this variable to Vercel:

```text
CANVA_ACCESS_TOKEN=your_canva_oauth_access_token
```

Without this token, `/api/canva` still returns a Canva-ready design brief and Canva AI prompt, but it cannot create a live Canva project.

### 3. Test live Canva design creation

```bash
curl -X POST https://devo-ai-os.vercel.app/api/canva \
-H "Content-Type: application/json" \
-d '{
  "input":"한마음과학원 워크숍 캐릭터 시트",
  "preset":"presentation",
  "pages":8,
  "create":true,
  "options":{
    "audience":"general audience",
    "format":"presentation",
    "style":"modern cinematic educational"
  }
}'
```

Expected response:

```json
{
  "ok": true,
  "mode": "live_canva_api",
  "canva": {
    "edit_url": "https://www.canva.com/api/design/.../edit",
    "view_url": "https://www.canva.com/api/design/.../view"
  }
}
```

### 4. Custom size example

```bash
curl -X POST https://devo-ai-os.vercel.app/api/canva \
-H "Content-Type: application/json" \
-d '{
  "input":"명상 포스터",
  "title":"DEVO Meditation Poster",
  "width":1080,
  "height":1620,
  "pages":1,
  "create":true
}'
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
