const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');
const catchAsync = require('../../../utils/catchAsync.util');

const createPatient = async (userId, payload) => {
  const isPatientExists = await Patient.findOne({ userId });

  if (isPatientExists) {
    throw new AppError('patient profile already exists!', 409); // 409 - conflict
  }

  // userId, isTemparory : false, payload
  const patient = Patient.create({
    userId,
    ...payload,
    isTemporary: false,
  });

  return patient;
};

module.exports = {
  createPatient,
};
