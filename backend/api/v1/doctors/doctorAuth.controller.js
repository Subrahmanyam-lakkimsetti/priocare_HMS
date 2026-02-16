const catchAsync = require('../../../utils/catchAsync.util');
const { DoctorDTO } = require('./doctor.dto');
const doctorService = require('./doctorAuth.service');

const createDotorController = catchAsync(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.data.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'profile created successfully',
    doctor: {
      doctor: new DoctorDTO(doctor),
    },
  });
});

const getDoctors = catchAsync(async (req, res) => {
  const doctors = await doctorService.getDoctors();

  res.status(200).json({
    isSuccess: true,
    message: 'list of all doctors',
    data: doctors,
  });
});

const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctor(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'doctor details',
    data: new DoctorDTO(doctor),
  });
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.params.id, req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'details updated successfully',
    data: new DoctorDTO(doctor),
  });
});

const getMe = catchAsync(async (req, res) => {
  const doctor = await doctorService.getMe(req.data.id);

  res.status(200).json({
    isSuccess: true,
    message: 'your profile details',
    data: new DoctorDTO(doctor),
  });
});

module.exports = {
  createDotorController,
  getDoctors,
  getDoctor,
  updateDoctor,
  getMe,
};
