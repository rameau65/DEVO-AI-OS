import { callProvider, providerStatus } from './llm-providers.js';

const CREATIVE_KEYWORDS = ['image', 'visual', 'poster', 'prompt', 'midjourney', 'character', 'storyboard', 'design', 'thumbnail', '영상', '이미지', '포스터', '프롬프트', '캐릭터', '콘티', '디자인', '썸네일'];
const CODE_KEYWORDS = ['code', 'github', 'commit', 'pull request', 'api', 'bug', 'typescript', 'javascript', 'deploy', '코드', '깃허브', '커밋', '배포', '버그'];
const FRESH_KEYWORDS = ['latest', 'news', 'today', 'trend', 'x', 'twitter', 'current', '최신', '뉴스', '오늘', '트렌드', '실시간'];
const LONG_CONTEXT_KEYWORDS = ['document', 'proposal', 'report', 'paper', 'summary', 'translate', '문서', '제안서', '보고서', '논문', '요약', '번역'];

function includesAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

export function classifyTask(input = {}) {
  const text = [
    input.intent,
    input.task,
    input.prompt,
    ...(input.messages || []).map(message => message.content)
  ].filter(Boolean).join(' ').toLowerCase();

  if (input.provider && input.provider !== 'auto') {
    return { route: input.provider, reason: 'User explicitly selected provider.' };
  }
  if (includesAny(text, FRESH_KEYWORDS)) {
    return { route: 'grok', reason: 'Fresh/current/trend-oriented request.' };
  }
  if (includesAny(text, CODE_KEYWORDS)) {
    return { route: 'claude', reason: 'Code, repository, API, or deployment-oriented request.' };
  }
  if (includesAny(text, LONG_CONTEXT_KEYWORDS)) {
    return { route: 'gemini', reason: 'Long-form document or summarization request.' };
  }
  if (includesAny(text, CREATIVE_KEYWORDS)) {
    return { route: 'openai', reason: 'Creative planning and production request.' };
  }
  return { route: 'openai', reason: 'General DEVO-AI-OS planning request.' };
}

export function buildMessages(input = {}) {
  if (Array.isArray(input.messages) && input.messages.length > 0) return input.messages;

  const system = input.system || `You are DEVO-AI-OS, a creative production operating system.\nReturn practical, structured, production-ready results.\nWhen useful, separate strategy, execution steps, and final deliverables.`;
  const user = input.prompt || input.task || '';

  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];
}

export async function orchestrateLLM(input = {}) {
  const classification = classifyTask(input);
  const messages = buildMessages(input);
  const providers = input.providers || [classification.route];
  const temperature = input.temperature ?? 0.4;
  const maxTokens = input.max_tokens || input.maxTokens || 1600;

  if (input.mode === 'ensemble') {
    const results = await Promise.allSettled(
      providers.map(provider => callProvider({ provider, messages, temperature, maxTokens }))
    );

    return {
      ok: results.some(result => result.status === 'fulfilled'),
      mode: 'ensemble',
      classification,
      providers: providerStatus(),
      results: results.map((result, index) => result.status === 'fulfilled'
        ? result.value
        : { provider: providers[index], error: result.reason?.message || String(result.reason) }
      )
    };
  }

  const fallbackOrder = input.fallbacks || ['openai', 'grok', 'claude', 'gemini'].filter(provider => provider !== classification.route);
  const attempts = [classification.route, ...fallbackOrder];
  const errors = [];

  for (const provider of attempts) {
    try {
      const result = await callProvider({ provider, messages, temperature, maxTokens });
      return {
        ok: true,
        mode: 'auto',
        classification,
        selected_provider: provider,
        providers: providerStatus(),
        result,
        errors
      };
    } catch (error) {
      errors.push({ provider, error: error.message });
    }
  }

  return {
    ok: false,
    mode: 'auto',
    classification,
    providers: providerStatus(),
    errors
  };
}
