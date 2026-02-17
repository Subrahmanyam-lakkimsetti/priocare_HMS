const { GoogleGenAI } = require('@google/genai');
const { Gemini_API_KEY, Gemini_model } = require('../config/gemini.config');

const ai = new GoogleGenAI(Gemini_API_KEY);

const aiClient = async (prompt) => {
  console.log('----generating..-------');
  const response = await ai.models.generateContent({
    model: Gemini_model,
    contents: prompt,
  });

  return response.text;
};

module.exports = {
  aiClient,
};
