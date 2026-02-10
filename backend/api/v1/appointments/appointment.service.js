const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');
const evaluateTriage = require('./triage/aiAdapter.triage');

const createAppointment = async (userId, triageData) => {
  // ckeck patient exists or not
  const isPatientExists = await Patient.findOne({ userId });
  if (!isPatientExists) {
    throw new AppError('Patient Not found!', 404);
  }

  // calculate triage
  const triage = await evaluateTriage(triageData);

  console.log('triage', triage);

  return 'success';
};

module.exports = {
  createAppointment,
};
