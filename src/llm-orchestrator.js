import { callProvider, providerStatus } from './llm-providers.js';

const CREATIVE_KEYWORDS = ['image', 'visual', 'poster', 'prompt', 'midjourney', 'character', 'storyboard', 'design', 'thumbnail', '영상', '이미지', '포스터', '프롬프트', '캐릭터', '콘티', '디자인', '썸네일'];
const CODE_KEYWORDS = ['code', 'github', 'commit', 'pull request', 'api', 'bug', 'typescript', 'javascript', 'deploy', '코드', '깃허브', '커밋', '배포', '버그'];
const FRESH_KEYWORDS = ['latest', 'news', 'today', 'trend', 'x', 'twitter', 'current', 'breaking', '최신', '뉴스', '오늘', '트렌드', '실시간', '속보'];
const LONG_CONTEXT_KEYWORDS = ['document', 'proposal', 'report', 'paper', 'summary', 'translate', '문서', '제안서', '보고서', '논문', '요약', '번역'];
const HIGH_STAKES_KEYWORDS = ['final', 'client', 'proposal', 'contract', 'legal', 'finance', 'medical', '중요', '최종', '클라이언트', '계약', '법률', '재무', '의료', '검증'];
const COMPLEXITY_KEYWORDS = ['compare', 'review', 'debug', 'architecture', 'strategy', 'risk', '비교', '검토', '디버그', '아키텍처', '전략', '위험'];

const BUDGET_PRESETS = {
  low: {
    maxTokens: 900,
    temperature: 0.25,
    allowTurbo: false,
    allowFallback: true,
    maxProviders: 1,
    fallbackOnlyOnError: true
  },
  normal: {
    maxTokens: 1600,
    temperature: 0.4,
    allowTurbo: false,
    allowFallback: true,
    maxProviders: 1,
    fallbackOnlyOnError: true
  },
  turbo: {
    maxTokens: 2200,
    temperature: 0.35,
    allowTurbo: true,
    allowFallback: true,
    maxProviders: 2,
    fallbackOnlyOnError: false
  },
  critical: {
    maxTokens: 2600,
    temperature: 0.3,
    allowTurbo: true,
    allowFallback: true,
    maxProviders: 3,
    fallbackOnlyOnError: false
  }
};

function includesAny(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

function compactMessages(messages = [], maxChars = 8000) {
  const compacted = messages.map(message => ({
    role: message.role || 'user',
    content: String(message.content || '').slice(0, maxChars)
  }));

  const total = compacted.reduce((sum, message) => sum + message.content.length, 0);
  if (total <= maxChars) return compacted;

  return compacted.map(message => ({
    ...message,
    content: message.content.slice(0, Math.max(500, Math.floor(maxChars / compacted.length)))
  }));
}

function estimateComplexity(text) {
  let score = 0;
  if (text.length > 1200) score += 1;
  if (text.length > 4000) score += 1;
  if (includesAny(text, HIGH_STAKES_KEYWORDS)) score += 1;
  if (includesAny(text, COMPLEXITY_KEYWORDS)) score += 1;
  if ((text.match(/\?/g) || []).length >= 3) score += 1;
  return score;
}

export function classifyTask(input = {}) {
  const text = [
    input.intent,
    input.task,
    input.prompt,
    ...(input.messages || []).map(message => message.content)
  ].filter(Boolean).join(' ').toLowerCase();

  const complexity = estimateComplexity(text);

  if (input.provider && input.provider !== 'auto') {
    return { route: input.provider, reason: 'User explicitly selected provider.', complexity };
  }
  if (includesAny(text, FRESH_KEYWORDS)) {
    return { route: 'grok', reason: 'Fresh/current/trend-oriented request.', complexity };
  }
  if (includesAny(text, CODE_KEYWORDS)) {
    return { route: 'claude', reason: 'Code, repository, API, or deployment-oriented request.', complexity };
  }
  if (includesAny(text, LONG_CONTEXT_KEYWORDS)) {
    return { route: 'gemini', reason: 'Long-form document or summarization request.', complexity };
  }
  if (includesAny(text, CREATIVE_KEYWORDS)) {
    return { route: 'openai', reason: 'Creative planning and production request.', complexity };
  }
  return { route: 'openai', reason: 'General DEVO-AI-OS planning request.', complexity };
}

export function buildMessages(input = {}, policy = BUDGET_PRESETS.normal) {
  if (Array.isArray(input.messages) && input.messages.length > 0) {
    return compactMessages(input.messages, input.max_input_chars || 8000);
  }

  const system = input.system || `You are DEVO-AI-OS, a token-efficient creative production operating system.
Default behavior: solve with one best model, avoid unnecessary verbosity, and only request multi-model support when confidence or risk requires it.
Return practical, structured, production-ready results.`;
  const user = input.prompt || input.task || '';

  return compactMessages([
    { role: 'system', content: system },
    { role: 'user', content: user }
  ], input.max_input_chars || 8000);
}

export function resolvePolicy(input = {}, classification = {}) {
  const requestedBudget = input.budget || input.cost_mode || 'normal';
  const base = BUDGET_PRESETS[requestedBudget] || BUDGET_PRESETS.normal;

  const turboRequested = input.turbo === true || input.mode === 'turbo' || input.mode === 'ensemble';
  const criticalByContent = classification.complexity >= 3;
  const turboAllowed = turboRequested || input.budget === 'turbo' || input.budget === 'critical' || criticalByContent;

  return {
    ...base,
    allowTurbo: Boolean(base.allowTurbo || turboAllowed),
    maxTokens: input.max_tokens || input.maxTokens || base.maxTokens,
    temperature: input.temperature ?? base.temperature,
    maxProviders: input.max_providers || input.maxProviders || base.maxProviders,
    fallbackOnlyOnError: input.fallbackOnlyOnError ?? base.fallbackOnlyOnError,
    budget: requestedBudget,
    turboReason: turboRequested
      ? 'Turbo explicitly requested.'
      : criticalByContent
        ? 'Turbo allowed because request appears high-complexity or high-stakes.'
        : 'Turbo not needed for this request.'
  };
}

function selectTurboProviders(primary, classification, requestedProviders = []) {
  if (requestedProviders.length > 0) {
    return [...new Set(requestedProviders.filter(provider => provider !== primary))];
  }

  if (classification.route === 'grok') return ['openai'];
  if (classification.route === 'claude') return ['openai'];
  if (classification.route === 'gemini') return ['openai'];
  return ['claude'];
}

function shouldUseTurbo(input, policy, classification, primaryResult) {
  if (!policy.allowTurbo) return false;
  if (input.mode === 'ensemble' || input.turbo === true) return true;
  if (classification.complexity >= 3) return true;
  if (String(primaryResult.content || '').length < 120 && classification.complexity >= 2) return true;
  return false;
}

export async function orchestrateLLM(input = {}) {
  const classification = classifyTask(input);
  const policy = resolvePolicy(input, classification);
  const messages = buildMessages(input, policy);
  const primaryProvider = classification.route;
  const errors = [];

  try {
    const primaryResult = await callProvider({
      provider: primaryProvider,
      messages,
      temperature: policy.temperature,
      maxTokens: policy.maxTokens
    });

    const useTurbo = shouldUseTurbo(input, policy, classification, primaryResult);

    if (!useTurbo) {
      return {
        ok: true,
        mode: 'single',
        turbo_used: false,
        cost_policy: policy,
        classification,
        selected_provider: primaryProvider,
        providers: providerStatus(),
        result: primaryResult,
        errors
      };
    }

    const turboProviders = selectTurboProviders(primaryProvider, classification, input.providers)
      .slice(0, Math.max(0, policy.maxProviders - 1));

    const turboResults = await Promise.allSettled(
      turboProviders.map(provider => callProvider({
        provider,
        messages: [
          ...messages,
          {
            role: 'user',
            content: `Review or improve the primary answer below. Be concise and focus only on corrections, risks, or missing high-value improvements.\n\nPrimary answer:\n${primaryResult.content}`
          }
        ],
        temperature: policy.temperature,
        maxTokens: Math.min(policy.maxTokens, 1200)
      }))
    );

    return {
      ok: true,
      mode: 'turbo_on_demand',
      turbo_used: turboProviders.length > 0,
      turbo_providers: turboProviders,
      cost_policy: policy,
      classification,
      selected_provider: primaryProvider,
      providers: providerStatus(),
      result: primaryResult,
      turbo_results: turboResults.map((result, index) => result.status === 'fulfilled'
        ? result.value
        : { provider: turboProviders[index], error: result.reason?.message || String(result.reason) }
      ),
      errors
    };
  } catch (error) {
    errors.push({ provider: primaryProvider, error: error.message });

    if (!policy.allowFallback) {
      return {
        ok: false,
        mode: 'single_failed',
        turbo_used: false,
        cost_policy: policy,
        classification,
        providers: providerStatus(),
        errors
      };
    }

    const fallbackOrder = (input.fallbacks || ['openai', 'grok', 'claude', 'gemini'])
      .filter(provider => provider !== primaryProvider)
      .slice(0, 2);

    for (const provider of fallbackOrder) {
      try {
        const result = await callProvider({
          provider,
          messages,
          temperature: policy.temperature,
          maxTokens: policy.maxTokens
        });
        return {
          ok: true,
          mode: 'fallback_only_on_error',
          turbo_used: false,
          cost_policy: policy,
          classification,
          selected_provider: provider,
          providers: providerStatus(),
          result,
          errors
        };
      } catch (fallbackError) {
        errors.push({ provider, error: fallbackError.message });
      }
    }

    return {
      ok: false,
      mode: 'fallback_failed',
      turbo_used: false,
      cost_policy: policy,
      classification,
      providers: providerStatus(),
      errors
    };
  }
}
