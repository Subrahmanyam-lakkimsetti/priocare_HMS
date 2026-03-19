const catchAsync = require('../../../../utils/catchAsync.util');
const {
  appointmentBytoken,
} = require('../../receptionists/receptionist.service');
const adminAppointmentService = require('./admin.appointments.service');

const getAppointmentsByDepartment = catchAsync(async (req, res) => {
  const appointments =
    await adminAppointmentService.getAppointmentsByDepartment();

  res.status(200).json({
    isSuccess: true,
    message: 'appointments by department',
    data: appointments,
  });
});

const cancelAppointment = catchAsync(async (req, res) => {
  const appointment = await adminAppointmentService.cancelAppointment(
    req.params,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'appointment cancelled',
    data: appointment,
  });
});

const appointmentByToken = catchAsync(async (req, res) => {
  const appointment = await appointmentBytoken(req.params.token);

  res.status(200).json({
    isSuccess: true,
    message: `appointment for token: ${req.params.token}`,
    data: appointment,
  });
});

module.exports = {
  getAppointmentsByDepartment,
  cancelAppointment,
  appointmentByToken,
};