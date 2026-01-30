const catchAsync = require('../../../utils/catchAsync.util');
const { PatientDTO } = require('./patient.dto');
const { createPatient } = require('./patient.service');

const createPatientController = catchAsync(async (req, res) => {
  const patient = await createPatient(req.data.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'patient profile created sucessfully',
    patient: new PatientDTO(patient),
  });
});

module.exports = {
  createPatientController,
};
