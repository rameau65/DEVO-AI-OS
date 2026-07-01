# DEVO-AI-OS MCP Server with OpenAI Integration

완전한 MCP 프로토콜과 OpenAI ChatGPT 통합

## 🚀 새 기능 (v2.0.0)

### MCP 프로토콜 완전 구현
- ✅ `/mcp` 엔드포인트 (MCP 클라이언트 호환)
- ✅ `/tools` 엔드포인트 (MCP 형식)
- ✅ MCP 프로토콜 v2024-11-05 대응

### OpenAI ChatGPT 통합
- ✅ `/openai` 엔드포인트 (OpenAI 호환 형식)
- ✅ `/openai/chat` 엔드포인트 (ChatGPT 연계)
- ✅ Function Calling 완전 대응
- ✅ API 키 관리

---

## 📋 배포 전 준비

### 1. Vercel 환경 변수 설정

Vercel Dashboard → Settings → Environment Variables

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
NODE_ENV=production
PORT=3000
```

### 2. OpenAI API 키 취득

1. https://platform.openai.com/account/api-keys
2. "+ Create new secret key" 클릭
3. 키를 복사
4. Vercel에 설정

---

## 🔗 엔드포인트 일람

### 헬스 체크
```bash
curl https://devo-ai-os.vercel.app/health
```

### 서버 정보
```bash
curl https://devo-ai-os.vercel.app/
```

### MCP 프로토콜 엔드포인트
```bash
curl https://devo-ai-os.vercel.app/mcp
```

### OpenAI 호환 도구
```bash
curl https://devo-ai-os.vercel.app/openai
```

---

## 💬 ChatGPT 연계 예

### Step 1: 도구 목록 취득
```bash
curl https://devo-ai-os.vercel.app/openai
```

### Step 2: ChatGPT에 전송
```bash
curl -X POST https://devo-ai-os.vercel.app/openai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Create a meditation video script about inner peace"
      }
    ]
  }'
```

---

## 🛠️ 사용 가능한 도구

1. **story_engine** - 스토리 구조 생성
2. **visual_engine** - 이미지 생성 프롬프트
3. **seedance_engine** - 영화 같은 비디오 생성
4. **music_engine** - 음악·사운드 방향
5. **meditation_engine** - 명상 스크립트 생성
6. **quality_engine** - 품질 리뷰
7. **flow_engine** - 엔드투엔드 워크플로우

---

## 🔐 ChatGPT 커스텀 지시사항

ChatGPT의 설정에 다음을 추가:

```
You have access to DEVO-AI-OS creative tools through the MCP protocol.

Available Tools:
- story_engine: Convert topics into narrative structures
- visual_engine: Generate image-generation prompts
- seedance_engine: Create cinematic video sequences
- music_engine: Create music and sound direction
- meditation_engine: Generate meditation scripts
- quality_engine: Review and improve creative outputs
- flow_engine: Design complete production workflows

API Endpoint: https://devo-ai-os.vercel.app/openai

When user requests creative content, use these tools to:
1. Structure the concept
2. Generate visual descriptions
3. Plan production workflow
4. Ensure quality
```

---

## 📝 도구 호출 예

### Story Engine
```bash
curl -X POST https://devo-ai-os.vercel.app/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "story_engine",
    "input": {
      "topic": "Meditation benefits",
      "audience": "Beginners",
      "duration": "5min",
      "tone": "educational"
    }
  }'
```

### Visual Engine
```bash
curl -X POST https://devo-ai-os.vercel.app/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "visual_engine",
    "input": {
      "concept": "Person meditating in nature",
      "style": "cinematic",
      "mood": "peaceful"
    }
  }'
```

### Meditation Engine
```bash
curl -X POST https://devo-ai-os.vercel.app/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "meditation_engine",
    "input": {
      "theme": "Inner peace",
      "emotion": "calm",
      "duration": "5min",
      "audience": "General"
    }
  }'
```

---

## 🔐 보안

### API 키 관리
- OpenAI API 키는 환경 변수에서 관리
- Vercel 암호 관리 기능 사용
- 본번 환경에서는 절대 공개 키를 사용하지 않음

### CORS 설정
- 모든 오리진에서의 요청을 허용
- 필요에 따라 특정 도메인으로 제한 가능

---

## 🚀 배포 방법

### Vercel에 배포
```bash
# 1. GitHub에 push
git add .
git commit -m "Add OpenAI integration and MCP protocol v2"
git push origin main

# 2. Vercel이 자동 배포

# 3. 환경 변수를 설정
# Vercel Dashboard → Settings → Environment Variables
```

### 로컬 테스트
```bash
# 환경 변수 설정
cp .env.example .env
echo "OPENAI_API_KEY=sk-proj-xxxxx" >> .env

# 서버 시작
npm run dev

# 테스트
curl http://localhost:3000/health
```

---

## 📊 로그와 모니터링

Vercel Dashboard → Logs:
- 실시간 로그 표시
- 에러 트래킹
- 퍼포먼스 메트릭스

---

## 🛠️ 트러블슈팅

### 에러: "OPENAI_API_KEY not set"
- 환경 변수가 설정되어 있는지 확인
- Vercel Dashboard에서 확인
- 배포 후 다시 테스트

### 에러: "Tool not found"
- `/mcp` 엔드포인트에서 사용 가능한 도구 일람 확인
- 도구명의 철자를 체크

### 에러: "OpenAI API error"
- API 키가 유효한지 확인
- API 쿼터 확인: https://platform.openai.com/account/usage

---

## 📚 참고 자료

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [ChatGPT API Reference](https://platform.openai.com/docs/api-reference/chat)
- [Vercel Documentation](https://vercel.com/docs)
- [DEVO-AI-OS Repository](https://github.com/rameau65/DEVO-AI-OS)

---

## ✨ 다음 스텝

1. ✅ Vercel에 배포
2. ✅ OpenAI API 키 설정
3. ✅ ChatGPT와 연계
4. ✅ 커스텀 지시사항을 설정
5. ✅ 본번 운용 시작

---

**Version:** 2.0.0
**MCP Protocol:** v2024-11-05
**OpenAI Integration:** ✅ Enabled
**Status:** 🚀 Production Ready
