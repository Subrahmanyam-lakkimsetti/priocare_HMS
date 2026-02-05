const catchAsync = require('../../../utils/catchAsync.util');
const { DoctorDTO } = require('./doctor.dto');
const { createDoctor } = require('./doctor.service');

const createDotorController = catchAsync(async (req, res) => {
  const doctor = await createDoctor(req.data.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'profile created successfully',
    doctor: {
      doctor: new DoctorDTO(doctor),
    },
  });
});

module.exports = {
  createDotorController,
};
