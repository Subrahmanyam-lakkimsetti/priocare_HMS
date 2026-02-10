const { GoogleGenAI } = require('@google/genai');
const { Gemini_API_KEY, Gemini_model } = require('../config/gemini.config');
const triagePrompt = require('../api/v1/appointments/triage/aiPrompt.triage');

const ai = new GoogleGenAI(Gemini_API_KEY);

const aiClient = async ({
  symptoms,
  vitals,
  comorbidities,
  age,
  description,
}) => {
  const aiTriagePrompt = `${triagePrompt} 
    Patient Data:
    - Age: ${age}
    - Symptoms: ${symptoms.join(', ')}
    - Vitals: ${JSON.stringify(vitals || {})} 
    - Comorbidities: ${comorbidities}
    - Description: ${description}
  `;

  const response = await ai.models.generateContent({
    model: Gemini_model,
    contents: aiTriagePrompt,
  });

  return response.text;
};

module.exports = {
  aiClient,
};
