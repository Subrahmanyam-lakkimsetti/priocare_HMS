const { aiClient } = require('../../../../utils/aiClient');
const { prompt } = require('./patientSummary.prompt');

const generateSummary = async (patientDetails) => {
  const { patient: personalDetails, triage } = patientDetails;

  const summeryPrompt = `${prompt} 

    Patient personal details
    
    age: ${personalDetails.age}
    gender: ${personalDetails.gender}
    bloodGroup: ${personalDetails.bloodGroup}

    Patient appointment triage Details

    symptoms: ${triage.symptoms?.join(', ')}

    vitals: ${JSON.stringify(triage.vitals || {}, null, 2)}

    comorbidities: ${triage.comorbidities?.join(', ') || 'None'}
    description: ${triage.description}

    priorityScore: ${triage.priorityScore}
    severity Level : ${triage.severityLevel}

    Remeinder
    Sumerixe only the provided data

    AND retuen only JSON response do not put any text before or after the brackets
  `;


  try {

    const raw = await aiClient(summeryPrompt);


    return JSON.parse(raw);
  } catch (error) {
    console.log('error', error.message);
  }
};

module.exports = {
  generateSummary,
};
