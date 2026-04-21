require('dotenv').config();

module.exports = {
  Gemini_API_KEY: process.env.GEMINI_API_KEY,
  Gemini_model: 'gemini-3-flash-preview',
  OpenRouter_API_KEY: process.env.OPENROUTER_API_KEY,
  OpenRouter_model: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
  OpenRouter_base_url:
    process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
};
