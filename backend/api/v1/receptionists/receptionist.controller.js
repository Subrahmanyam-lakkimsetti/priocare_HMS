const catchAsync = require('../../../utils/catchAsync.util');
const receptionistService = require('./receptionist.service');

const patientCheckin = catchAsync(async (req, res) => {
  const updatedAppointment = await receptionistService.patientCheckin(
    req.params,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'patient checked-in sucessful',
    data: updatedAppointment,
  });
});

const dashboardStats = catchAsync(async (req, res) => {
  const stats = await receptionistService.dashboardStats(req.query?.date);

  res.status(200).json({
    isSuccess: true,
    message: 'receptionist stats',
    data: stats,
  });
});

const todaysAppointments = catchAsync(async (req, res) => {
  const appointments = await receptionistService.todaysAppointments(
    req.query?.date,
  );

  res.status(200).json({
    isSuccess: true,
    totalDocuments: appointments.length,
    message: 'todays appointments',
    data: appointments,
  });
});

const appointmentBytoken = catchAsync(async (req, res) => {
  const appointment = await receptionistService.appointmentBytoken(
    req.params?.token,
  );

  res.status(200).json({
    isSuccess: true,
    message: `appointment for token: ${req.params?.token}`,
    data: appointment,
  });
});

const queueStats = catchAsync(async (req, res) => {
  const stats = await receptionistService.queueStatus(req.query.date);

  res.status(200).json({
    isSuccess: true,
    message: "doctors queue's status",
    data: stats,
  });
});

const recentCheckins = catchAsync(async (req, res) => {
  const appts = await receptionistService.recentCheckins();

  res.status(200).json({
    isSuccess: true,
    totalDocuments: appts.length,
    message: 'recent checkins',
    data: appts,
  });
});

module.exports = {
  patientCheckin,
  dashboardStats,
  todaysAppointments,
  appointmentBytoken,
  queueStats,
  recentCheckins,
};