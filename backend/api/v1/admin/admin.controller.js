const catchAsync = require('../../../utils/catchAsync.util');
const { UserDTO } = require('../auth/auth.dto');
const adminService = require('./admin.service');

const createDoctorUser = catchAsync(async (req, res) => {
  const doctor = await adminService.createDoctorUser(req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'doctor created sucessfully',
    data: new UserDTO(doctor),
  });
});

const createReceptionist = catchAsync(async (req, res) => {
  const receptionist = await adminService.createReceptionist(req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'receptionist created sucessfully',
    data: receptionist,
  });
});

module.exports = {
  createDoctorUser,
  createReceptionist,
};
