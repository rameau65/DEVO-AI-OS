# onemind / SKILL

**Creative AI workflow system for story, visual, video, music, education, knowledge design, and reusable skill workflows.**

onemind는 특정 AI 도구 하나를 위한 프롬프트 모음이 아닙니다. 하나의 주제나 아이디어를 **스토리, 이미지, 영상, 음악, 교육자료, 문서, 채널 운영 패키지**로 확장하기 위한 범용 AI 창작 시스템입니다.

## Core Philosophy

```text
Complex Knowledge → Story → Image → Experience → Change
복잡한 지식 → 이야기 → 이미지 → 경험 → 변화
```

## Main Structure

```text
/core             운영 원칙, 시스템 프롬프트, 출력 규칙
/world_bible      세계관, 철학, 브랜드/프로젝트별 지식
/engines          Story, Visual, Video, Music 등 기능 엔진
/workflows        주제 → 결과물까지의 실행 파이프라인
/templates        반복 사용 가능한 제작 템플릿
/agents           역할 기반 AI 에이전트 정의
/skills           Claude/ChatGPT/Manus/Gemini 공용 Skill 문서
/examples         샘플 프로젝트
/projects         실제 프로젝트별 확장 영역
/docs             배포/운영 문서
```

## Quick Start

1. `core/SYSTEM_PROMPT.md`를 AI 프로젝트 지침으로 등록합니다.
2. 작업 목적에 맞는 `engines/*.md`를 참조합니다.
3. `workflows/`에서 실행 파이프라인을 선택합니다.
4. `templates/`의 양식에 주제를 입력합니다.
5. 결과물을 `QUALITY_ENGINE`으로 검수합니다.

## Primary Engines

- STORY_ENGINE
- NOVEL_ENGINE
- SCRIPT_ENGINE
- VISUAL_ENGINE
- VIDEO_ENGINE
- MUSIC_ENGINE
- MEDITATION_ENGINE
- AI_TOON_ENGINE
- INFOGRAPHIC_ENGINE
- BRAND_ENGINE
- MARKETING_ENGINE
- CHANNEL_ENGINE
- PROMPT_LIBRARY_ENGINE
- QUALITY_ENGINE
- EXPANSION_ENGINE

## Supported AI Tools

ChatGPT, Claude, Gemini, Grok, Manus, MidJourney, Niji, Hailuo, Kling, Seedance, Runway, Sora, Suno, Canva, PowerPoint, GitHub.

## License

MIT License. See [LICENSE](LICENSE).

## Version

Current master structure: **onemind v4.0 distribution architecture**.
