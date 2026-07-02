# API Tests

## Health

```bash
curl https://devo-ai-os.vercel.app/api/health
```

## OpenAI Router

```bash
curl -X POST https://devo-ai-os.vercel.app/api/openai \
-H "Content-Type: application/json" \
-d '{"input":"Canva Agent Engine를 만들어줘"}'
```

## GitHub API

```bash
curl https://devo-ai-os.vercel.app/api/github \
-H "x-devo-secret: YOUR_SECRET"
```
