const catchAsync = require('../../../utils/catchAsync.util');
const appointmentService = require('../appointments/appointment.service');

const createAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointment(
    req.data.id,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    data: appointment,
  });
});

const getDoctorsAccordingToSpecilization = catchAsync(async (req, res) => {
  const doctors = await appointmentService.getDoctorsAccordingToSpecilization(
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'available doctors according to patient symptoms',
    data: {
      doctors,
    },
  });
});

const createAppointmentManualAssign = catchAsync(async (req, res) => {
  const appointment = await appointmentService.createAppointmentManualAssign(
    req.body,
    req.data.id,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'appointment created successfully',
    data: {
      appointment,
    },
  });
});

const getAppointmentsForUser = catchAsync(async (req, res) => {
  const appointments = await appointmentService.getAppointmentsForUser(
    req.data.id,
  );

  res.status(200).json({
    isSuccess: true,
    totlaDocuments: appointments.length,
    message: 'your appointments',
    data: appointments,
  });
});

const getActiveAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getActiveAppointment(
    req.data.id,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'current active appointment',
    data: appointment,
  });
});

const getAppointmnetByToken = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentByToken(
    req.params,
    req.data.id,
  );

  if (!appointment) {
    res.status(200).json({
      isSuccess: true,
      message: 'No appointment found',
    });
  }

  res.status(200).json({
    isSuccess: true,
    message: 'appointment details',
    data: appointment,
  });
});

const cancelAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'Appointment cancelled successfully',
    data: appointment,
  });
});

const getPrescriptionByToken = catchAsync(async (req, res) => {
  const prescription = await appointmentService.getPrescriptionByToken(req);

  res.status(200).json({
    isSuccess: true,
    message: `prescription for appointment ${req.params.token}`,
    data: {
      prescription,
    },
  });
});

module.exports = {
  createAppointment,
  getDoctorsAccordingToSpecilization,
  createAppointmentManualAssign,
  getAppointmnetByToken,
  getActiveAppointment,
  getAppointmentsForUser,
  cancelAppointment,
  getPrescriptionByToken,
};
