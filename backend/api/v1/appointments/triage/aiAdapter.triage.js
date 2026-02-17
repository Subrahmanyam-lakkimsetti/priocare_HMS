const { aiClient } = require('../../../../utils/aiClient');
const AppError = require('../../../../utils/AppError.util');
const triagePrompt = require('./aiPrompt.triage');

const evaluateTriage = async (input) => {
  try {
    const { symptoms, vitals, comorbidities, age, description } = input.triage;

    const aiTriagePrompt = `${triagePrompt} 
        Patient Data:
        - Age: ${age}
        - Symptoms: ${symptoms.join(', ')}
        - Vitals: ${JSON.stringify(vitals || {})} 
        - Comorbidities: ${comorbidities}
        - Description: ${description}
      `;

    return await aiClient(aiTriagePrompt);
  } catch (error) {
    throw new AppError('AI failed to generate Response', 401);
  }
};

module.exports = evaluateTriage;
