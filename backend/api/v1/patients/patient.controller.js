const catchAsync = require('../../../utils/catchAsync.util');
const { PatientDTO } = require('./patient.dto');
const {
  createPatient,
  getPatient,
  updatePatient,
  getPatientById,
} = require('./patient.service');

const createPatientController = catchAsync(async (req, res) => {
  const patient = await createPatient(req.data.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'patient profile created sucessfully',
    patient: new PatientDTO(patient),
  });
});

const getPatientController = catchAsync(async (req, res) => {
  const patient = await getPatient(req.data);

  res.status(200).json({
    isSuccess: true,
    message: 'your patient profile',
    patient: new PatientDTO(patient),
  });
});

const updatePatientController = catchAsync(async (req, res) => {
  const updatedPatient = await updatePatient(req);

  res.status(200).json({
    isSuccess: true,
    message: 'Patient profile updated sucessfully',
    patient: new PatientDTO(updatedPatient),
  });
});

const getPatientByIdController = catchAsync(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  res.status(200).json({
    isSuccess: true,
    message: 'patient details',
    patient: new PatientDTO(patient),
  });
});

module.exports = {
  createPatientController,
  getPatientController,
  updatePatientController,
  getPatientByIdController,
};
