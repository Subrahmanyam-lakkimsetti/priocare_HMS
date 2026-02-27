const Patient = require('../../../models/patient.model');
const AppError = require('../../../utils/AppError.util');

UPDATE_ALLOWED_FIELDS = [
  'firstName',
  'lastName',
  'age',
  'gender',
  'phoneNumber',
  'address',
  'bloodGroup',
  'insuranceDetails',
];

const createPatient = async (userId, payload, file) => {
  if (file) {
    payload.photo = file.path;
  }
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

const getPatient = async ({ id }) => {
  // get the patient
  const patient = await Patient.findOne({ userId: id }).populate(
    'userId',
    'email',
  );

  if (!patient) {
    throw new AppError('Patient profile does not found', 404);
  }

  // return that patient
  return patient;
};

const updatePatient = async ({ data: { id: userId }, body: updates, file }) => {
  const filteredObj = {};

  Object.keys(updates).forEach((field) => {
    if (UPDATE_ALLOWED_FIELDS.includes(field)) {
      filteredObj[field] = updates[field];
    }
  });

  const updateData = { ...filteredObj };

  if (file) {
    updateData.photo = file.path;
  }

  const patient = await Patient.findOneAndUpdate({ userId }, updateData, {
    new: true,
  });

  if (!patient) {
    throw new AppError('Patient profile does not found', 404);
  }

  return patient;
};

const getPatientById = async (patientId) => {
  const patient = await Patient.findById(patientId);

  if (!patient) {
    throw new AppError('patient not found', 404);
  }

  return patient;
};

module.exports = {
  createPatient,
  getPatient,
  updatePatient,
  getPatientById,
};
