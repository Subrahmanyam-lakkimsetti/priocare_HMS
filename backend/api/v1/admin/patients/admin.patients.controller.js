const catchAsync = require('../../../../utils/catchAsync.util');
const adminPatientService = require('./admin.patients.service');

const getPatientsWithStats = catchAsync(async (req, res) => {
  const patients = await adminPatientService.getPatientsWithStats();

  res.status(200).json({
    isSuccess: true,
    message: 'all patients along with the stats',
    data: patients,
  });
});

const frequentelyVisitedPatients = catchAsync(async (req, res) => {
  const frequentPatients =
    await adminPatientService.frequentelyVisitedPatients();

  res.status(200).json({
    isSuccess: true,
    message: 'frequentely visited patients',
    data: frequentPatients,
  });
});

const deActivatePatient = catchAsync(async (req, res) => {
  const patient = await adminPatientService.deActivatePatient(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'patient deactivated',
    data: patient,
  });
});

const activatePatient = catchAsync(async (req, res) => {
  console.log(req.params);
  const patient = await adminPatientService.activatePatient(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'patient Ativated',
    data: patient,
  });
});

module.exports = {
  getPatientsWithStats,
  frequentelyVisitedPatients,
  deActivatePatient,
  activatePatient,
};