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
  const patient = await Patient.findOne({ userId: id });

  if (!patient) {
    throw new AppError('Patient profile does not found', 404);
  }

  // return that patient
  return patient;
};

const updatePatient = async ({ data: { id: userId }, body: updates, file }) => {
  let photo;
  if (file) {
    photo = file.path;
  }

  const filteredObj = {};

  Object.keys(updates).map((field) => {
    if (UPDATE_ALLOWED_FIELDS.includes(field)) {
      return (filteredObj[field] = updates[field]);
    }
  });

  const patient = await Patient.findOneAndUpdate(
    { userId },
    {
      ...filteredObj,
      photo,
    },
    {
      new: true,
    },
  );

  // get the patient
  // const patient = await Patient.findOne({ userId });

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
