const DEFAULT_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 45000);

export const PROVIDERS = {
  openai: {
    name: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    modelEnv: 'OPENAI_MODEL',
    defaultModel: 'gpt-4.1-mini'
  },
  grok: {
    name: 'Grok',
    envKey: 'XAI_API_KEY',
    modelEnv: 'GROK_MODEL',
    defaultModel: 'grok-3-mini',
    baseUrlEnv: 'XAI_BASE_URL',
    defaultBaseUrl: 'https://api.x.ai/v1'
  },
  claude: {
    name: 'Claude',
    envKey: 'ANTHROPIC_API_KEY',
    modelEnv: 'CLAUDE_MODEL',
    defaultModel: 'claude-3-5-sonnet-latest'
  },
  gemini: {
    name: 'Gemini',
    envKey: 'GEMINI_API_KEY',
    modelEnv: 'GEMINI_MODEL',
    defaultModel: 'gemini-1.5-flash'
  }
};

function withTimeout(ms = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, cancel: () => clearTimeout(timeout) };
}

export function providerStatus() {
  return Object.entries(PROVIDERS).map(([id, config]) => ({
    id,
    name: config.name,
    configured: Boolean(process.env[config.envKey]),
    model: process.env[config.modelEnv] || config.defaultModel
  }));
}

export function messagesToPrompt(messages = []) {
  if (typeof messages === 'string') return messages;
  return messages
    .map(message => `${message.role || 'user'}: ${message.content || ''}`)
    .join('\n');
}

export async function callOpenAICompatible({ providerId, messages, temperature = 0.4, maxTokens = 1600 }) {
  const provider = PROVIDERS[providerId];
  if (!provider) throw new Error(`Unsupported OpenAI-compatible provider: ${providerId}`);

  const apiKey = process.env[provider.envKey];
  if (!apiKey) throw new Error(`Missing ${provider.envKey}`);

  const baseUrl = process.env[provider.baseUrlEnv] || provider.defaultBaseUrl || 'https://api.openai.com/v1';
  const model = process.env[provider.modelEnv] || provider.defaultModel;
  const timer = withTimeout();

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      signal: timer.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`${provider.name} API error ${response.status}: ${json.error?.message || response.statusText}`);
    }

    return {
      provider: providerId,
      model,
      content: json.choices?.[0]?.message?.content || '',
      raw: json
    };
  } finally {
    timer.cancel();
  }
}

export async function callClaude({ messages, temperature = 0.4, maxTokens = 1600 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const model = process.env.CLAUDE_MODEL || PROVIDERS.claude.defaultModel;
  const system = messages.find(message => message.role === 'system')?.content || 'You are a helpful DEVO-AI-OS agent.';
  const userMessages = messages.filter(message => message.role !== 'system');
  const timer = withTimeout();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: timer.signal,
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        system,
        messages: userMessages,
        temperature,
        max_tokens: maxTokens
      })
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Claude API error ${response.status}: ${json.error?.message || response.statusText}`);
    }

    return {
      provider: 'claude',
      model,
      content: json.content?.map(block => block.text || '').join('\n') || '',
      raw: json
    };
  } finally {
    timer.cancel();
  }
}

export async function callGemini({ messages, temperature = 0.4, maxTokens = 1600 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');

  const model = process.env.GEMINI_MODEL || PROVIDERS.gemini.defaultModel;
  const prompt = messagesToPrompt(messages);
  const timer = withTimeout();

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      signal: timer.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens
        }
      })
    });

    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(`Gemini API error ${response.status}: ${json.error?.message || response.statusText}`);
    }

    return {
      provider: 'gemini',
      model,
      content: json.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('\n') || '',
      raw: json
    };
  } finally {
    timer.cancel();
  }
}

export async function callProvider({ provider, messages, temperature, maxTokens }) {
  if (provider === 'openai' || provider === 'grok') {
    return callOpenAICompatible({ providerId: provider, messages, temperature, maxTokens });
  }
  if (provider === 'claude') return callClaude({ messages, temperature, maxTokens });
  if (provider === 'gemini') return callGemini({ messages, temperature, maxTokens });
  throw new Error(`Unknown provider: ${provider}`);
}
