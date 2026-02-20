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
  const { date } = req.query;
  const userId = req.data.id;

  const patientDetails = await doctorService.startConsultation(userId, date);

  res.status(200).json({
    isSuccess: true,
    message: 'patient in consultation',
    data: patientDetails,
  });
});

const getAiSummary = catchAsync(async (req, res) => {
  const { token } = req.params;

  const aiSummary = await doctorService.getAiSummary(token);

  res.status(200).json({
    isSuccess: true,
    message: 'AI summary',
    data: aiSummary,
  });
});

module.exports = { getQueue, callPatient, startConsultation, getAiSummary };
