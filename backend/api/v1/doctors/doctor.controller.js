const Doctor = require('../../../models/doctor.model');
const catchAsync = require('../../../utils/catchAsync.util');
const { getDoctorQueue } = require('../appointments/doctorQueue.service');
const doctorService = require('./doctor.service');

const getQueue = catchAsync(async (req, res) => {
  const { date } = req.query;

  const userId = req.data.id;

  const doctor = await Doctor.findOne({ userId });

  const queue = await getDoctorQueue(doctor._id, date);

  res.status(200).json({
    isSuccess: true,
    message: `Queue for ${date}`,
    totalDocuments: queue?.patients?.length,
    data: queue,
  });
});

const callPatient = catchAsync(async (req, res) => {
  const { date } = req.query;

  const userId = req.data.id;

  const calledPatient = await doctorService.callPatient(userId, date);

  res.status(200).json({
    isSuccess: true,
    message: 'patient called Successful',
    data: {
      tokenNumber: calledPatient?.token,
      calledAt: calledPatient.calledAt,
    },
  });
});

const startConsultation = catchAsync(async (req, res) => {
  const userId = req.data.id;

  const patientDetails = await doctorService.startConsultation(userId);

  res.status(200).json({
    isSuccess: true,
    message: 'patient in consultation',
    data: patientDetails,
  });
});

const getAiSummary = catchAsync(async (req, res) => {
  const aiSummary = await doctorService.getAiSummary(req.params.token);

  res.status(200).json({
    isSuccess: true,
    message: 'AI summary',
    data: aiSummary,
  });
});

const endConsultation = catchAsync(async (req, res) => {
  await doctorService.endConsultation(req.params.token);

  res.status(200).json({
    isSuccess: true,
    message: 'consultation ended',
  });
});

const getActiveConsultation = catchAsync(async (req, res) => {
  const activeAppointment = await doctorService.getActiveConsultation(
    req.data.id,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'Active Appointment state',
    data: activeAppointment,
  });
});

const treatedPatientsHistory = catchAsync(async (req, res) => {
  const patients = await doctorService.treatedPatientsHistory(req.data.id);

  res.status(200).json({
    isSuccess: true,
    message: 'patients history',
    data: patients,
  });
});

module.exports = {
  getQueue,
  callPatient,
  startConsultation,
  getAiSummary,
  endConsultation,
  getActiveConsultation,
  treatedPatientsHistory,
};
