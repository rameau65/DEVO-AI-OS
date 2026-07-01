# DEVO-AI-OS API Template

## Endpoints

- `/api/openai`
- `/api/router`
- `/api/engines`
- `/api/workflows`
- `/api/quality`
- `/api/canva`
- `/api/github`

## GitHub Environment Variables

Create `.env.local`:

```bash
GITHUB_TOKEN=your_fine_grained_github_token
GITHUB_OWNER=rameau65
GITHUB_REPO=DEVO-AI-OS
```

## Test Example

```bash
curl -X POST http://localhost:3000/api/openai \
  -H "Content-Type: application/json" \
  -d '{"input":"Canva Agent Engine 추가해줘"}'
```
