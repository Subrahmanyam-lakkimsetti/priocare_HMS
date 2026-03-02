const catchAsync = require('../../../utils/catchAsync.util');
const { PatientDTO } = require('./patient.dto');
const {
  createPatient,
  getPatient,
  updatePatient,
  getPatientById,
} = require('./patient.service');

const createPatientController = catchAsync(async (req, res) => {
  const patient = await createPatient(req.data.id, req.body, req.file);

  res.status(200).json({
    isSuccess: true,
    message: 'patient profile created sucessfully',
    data: new PatientDTO(patient),
  });
});

const getPatientController = catchAsync(async (req, res) => {
  const patient = await getPatient(req.data);

  res.status(200).json({
    isSuccess: true,
    message: 'your patient profile',
    data: new PatientDTO(patient),
  });
});

const updatePatientController = catchAsync(async (req, res) => {
  console.log('file', req.file);
  const updatedPatient = await updatePatient(req);

  res.status(200).json({
    isSuccess: true,
    message: 'Patient profile updated sucessfully',
    data: new PatientDTO(updatedPatient),
  });
});

const getPatientByIdController = catchAsync(async (req, res) => {
  const patient = await getPatientById(req.params.id);

  res.status(200).json({
    isSuccess: true,
    message: 'patient details',
    data: new PatientDTO(patient),
  });
});

module.exports = {
  createPatientController,
  getPatientController,
  updatePatientController,
  getPatientByIdController,
};
