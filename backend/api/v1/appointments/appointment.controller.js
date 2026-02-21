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



module.exports = {
  createAppointment,
};
