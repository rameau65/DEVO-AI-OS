# DEVO-AI-OS

AI Creative Operating System.

## Local Run

```bash
npm install
npm run dev
```

## Test

Open:

```text
http://localhost:3000
http://localhost:3000/api/health
http://localhost:3000/api/openai
```

POST test:

```bash
curl -X POST http://localhost:3000/api/openai \
-H "Content-Type: application/json" \
-d '{"input":"Canva Agent Engine를 만들어줘"}'
```

## Vercel

Import this repository into Vercel.

Settings:

```text
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Install Command: npm install
```
