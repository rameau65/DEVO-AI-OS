# DEVO-AI-OS MCP Server - Vercel Deployment Guide

## ✅ 배포 완료

이 저장소는 이제 **Vercel**에 배포될 준비가 완료되었습니다!

## 🚀 빠른 배포 가이드

### Step 1: Vercel 계정 생성
1. https://vercel.com/signup 방문
2. GitHub 계정으로 로그인

### Step 2: 프로젝트 배포
1. https://vercel.com/new 방문
2. "Import Git Repository" 선택
3. `rameau65/DEVO-AI-OS` 선택
4. "Deploy" 클릭

### Step 3: 환경 변수 설정 (선택사항)
Vercel 대시보드에서 Settings → Environment Variables:
```
NODE_ENV=production
PORT=3000
```

## 📡 배포된 URL 확인

배포 완료 후:
```
https://devo-ai-os.vercel.app
```

또는 커스텀 도메인 설정 가능

## 🔗 API 엔드포인트

### Health Check
```bash
curl https://devo-ai-os.vercel.app/health
```

### 서버 정보
```bash
curl https://devo-ai-os.vercel.app/
```

### 도구 목록
```bash
curl https://devo-ai-os.vercel.app/tools
```

### 리소스 목록
```bash
curl https://devo-ai-os.vercel.app/resources
```

### 도구 호출
```bash
curl -X POST https://devo-ai-os.vercel.app/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "story_engine",
    "input": {
      "topic": "AI and Creativity",
      "audience": "General",
      "duration": "5min",
      "tone": "inspirational"
    }
  }'
```

## 📋 호출 예제

### Story Engine
```json
{
  "tool": "story_engine",
  "input": {
    "topic": "Meditation Benefits",
    "audience": "Beginners",
    "duration": "5min",
    "tone": "educational"
  }
}
```

### Visual Engine
```json
{
  "tool": "visual_engine",
  "input": {
    "concept": "Morning meditation in nature",
    "style": "cinematic",
    "mood": "peaceful"
  }
}
```

### Seedance Engine
```json
{
  "tool": "seedance_engine",
  "input": {
    "theme": "Inner peace journey",
    "duration": "3min",
    "style_preset": "MEDITATION_CINEMA",
    "music_mood": "ambient"
  }
}
```

### Music Engine
```json
{
  "tool": "music_engine",
  "input": {
    "mood": "contemplative",
    "duration": "5min",
    "genre": "ambient",
    "instruments": ["synth pads", "strings"]
  }
}
```

### Meditation Engine
```json
{
  "tool": "meditation_engine",
  "input": {
    "theme": "Finding inner peace",
    "emotion": "calm",
    "duration": "5min",
    "audience": "General"
  }
}
```

### Quality Engine
```json
{
  "tool": "quality_engine",
  "input": {
    "content": "Your creative content here",
    "content_type": "story",
    "target_audience": "Students"
  }
}
```

### Flow Engine
```json
{
  "tool": "flow_engine",
  "input": {
    "project_goal": "Create meditation video series",
    "output_format": ["video", "audio", "document"],
    "available_tools": ["MidJourney", "Suno", "Seedance"],
    "timeline": "2 weeks"
  }
}
```

## 🔍 모니터링

Vercel 대시보드에서:
- Deployments: 배포 이력
- Analytics: 트래픽 분석
- Logs: 서버 로그
- Settings: 프로젝트 설정

## 🆘 문제 해결

### 배포 실패
1. GitHub 연결 확인
2. package.json 유효성 확인
3. Vercel 대시보드에서 빌드 로그 확인

### 서버 응답 없음
1. Health endpoint 확인: `/health`
2. Vercel 대시보드에서 상태 확인
3. 환경 변수 설정 확인

## 📚 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Node.js on Vercel](https://vercel.com/docs/runtimes/nodejs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [DEVO-AI-OS Repository](https://github.com/rameau65/DEVO-AI-OS)

## ✨ 다음 단계

1. ✅ Vercel에 배포
2. 📊 분석 및 모니터링
3. 🔐 API 키 설정
4. 🚀 커스텀 도메인 추가
5. 📈 자동 배포 설정

---

**배포 완료 후 이 URL을 사용하세요:**
```
https://devo-ai-os.vercel.app
```

또는 Vercel 대시보드에서 확인한 실제 URL을 사용하세요.
