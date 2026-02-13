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

module.exports = {
  patientCheckin,
};
