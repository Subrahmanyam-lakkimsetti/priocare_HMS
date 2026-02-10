const { aiClient } = require('../../../../utils/aiClient');

const evaluateTriage = async (input) => {
  try {
    return await aiClient(input.triage);
  } catch (error) {
    console.log(error);
  }
};

module.exports = evaluateTriage;
