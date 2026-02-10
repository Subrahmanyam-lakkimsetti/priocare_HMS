const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');
const assignDoctor = require('./doctorAssign.service');
const evaluateTriage = require('./triage/aiAdapter.triage');

const createAppointment = async (userId, triageData) => {
  // ckeck patient exists or not
  const isPatientExists = await Patient.findOne({ userId });
  if (!isPatientExists) {
    throw new AppError('Patient Not found!', 404);
  }

  // calculate triage
  // const triage = await evaluateTriage(triageData);

  // console.log('triage', triage);
  console.log('triageData', triageData);

  const triage = {};

  console.log();
  const doctor = await assignDoctor({
    priorityScore: triage?.recommendedApecialization || 25,
    severityLevel: triage?.priorityScore || 'low',
    specilization: triage?.severityLevel || 'General Medicine',
    scheduledDate: triageData.scheduledDate,
    scheduledTime: triageData.scheduledTime,
  });

  return 'success';
};

module.exports = {
  createAppointment,
};
