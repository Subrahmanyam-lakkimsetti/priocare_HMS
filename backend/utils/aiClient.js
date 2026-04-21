const { GoogleGenAI } = require('@google/genai');
const {
  Gemini_API_KEY,
  Gemini_model,
  OpenRouter_API_KEY,
  OpenRouter_model,
  OpenRouter_base_url,
} = require('../config/gemini.config');

const geminiClient = Gemini_API_KEY
  ? new GoogleGenAI({ apiKey: Gemini_API_KEY })
  : null;

const isGeminiLimitError = (error) => {
  const status =
    error?.status || error?.response?.status || error?.error?.status;

  if (Number(status) === 429) {
    return true;
  }

  const normalizedMessage = String(
    error?.message || error?.error?.message || '',
  ).toLowerCase();

  return [
    'quota',
    'rate limit',
    'resource_exhausted',
    'too many requests',
    'exceeded',
    '429',
    'limit',
  ].some((token) => normalizedMessage.includes(token));
};

const callGemini = async (prompt) => {
  if (!geminiClient) {
    throw new Error('Gemini API key is missing');
  }

  const response = await geminiClient.models.generateContent({
    model: Gemini_model,
    contents: prompt,
  });

  if (!response?.text) {
    throw new Error('Gemini returned an empty response');
  }

  return response.text;
};

const callOpenRouter = async (prompt) => {
  if (!OpenRouter_API_KEY) {
    throw new Error('OpenRouter API key is missing');
  }

  if (!OpenRouter_base_url) {
    throw new Error('OpenRouter base URL is not configured');
  }

  const requestOpenRouter = async (modelName) => {
    const response = await fetch(`${OpenRouter_base_url}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OpenRouter_API_KEY}`,
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: String(prompt || '') }],
        temperature: 0.2,
        max_tokens: 1024,
        stream: false,
      }),
    });

    const payload = await response.json().catch(() => null);
    return { response, payload };
  };

  const configuredModel = OpenRouter_model || 'openai/gpt-4o-mini';
  let usedModel = configuredModel;
  let { response, payload } = await requestOpenRouter(usedModel);

  const shouldRetryDefaultModel =
    !response.ok &&
    usedModel !== 'openai/gpt-4o-mini' &&
    [400, 401, 403, 404].includes(response.status);

  if (shouldRetryDefaultModel) {
    console.warn(
      `OpenRouter model ${usedModel} failed with ${response.status}. Retrying with openai/gpt-4o-mini.`,
    );
    usedModel = 'openai/gpt-4o-mini';
    ({ response, payload } = await requestOpenRouter(usedModel));
  }

  if (!response.ok) {
    const errorMessage =
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}`;

    const errorDetails = payload?.error?.type || payload?.error?.code;
    const detailsSuffix = errorDetails ? ` (${errorDetails})` : '';

    throw new Error(
      `OpenRouter API request failed (${response.status}, model ${usedModel}): ${errorMessage}${detailsSuffix}`,
    );
  }

  const text = payload?.choices?.[0]?.message?.content;

  if (!text || typeof text !== 'string') {
    throw new Error('OpenRouter returned an empty response');
  }

  return text;
};

const aiClient = async (prompt) => {
  try {
    return await callGemini(prompt);
  } catch (error) {
    if (!isGeminiLimitError(error)) {
      throw error;
    }

    if (!OpenRouter_API_KEY) {
      throw new Error(
        'Gemini limit exceeded and OPENROUTER_API_KEY is not configured for fallback',
      );
    }

    console.warn(
      'Gemini rate/quota limit reached. Falling back to OpenRouter model.',
    );

    return callOpenRouter(prompt);
  }
};

module.exports = {
  aiClient,
};
