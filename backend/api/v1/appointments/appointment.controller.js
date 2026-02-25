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

  console.log('appointment in controller:', appointment);

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
  await appointmentService.cancelAppointment(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'Appointment cancelled successfully',
  });
});

module.exports = {
  createAppointment,
  getAppointmnetByToken,
  getActiveAppointment,
  getAppointmentsForUser,
  cancelAppointment,
};
