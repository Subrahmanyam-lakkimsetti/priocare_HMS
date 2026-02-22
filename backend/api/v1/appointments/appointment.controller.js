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

  res.status(200).json({
    isSuccess: true,
    message: 'appointment details',
    data: appointment,
  });
});

module.exports = {
  createAppointment,
  getAppointmnetByToken,
  getActiveAppointment,
};
