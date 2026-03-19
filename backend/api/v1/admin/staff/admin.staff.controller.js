const catchAsync = require('../../../../utils/catchAsync.util');
const adminStaffService = require('./admin.staff.service');

const getAllDoctorsByDepartment = catchAsync(async (req, res) => {
  const doctors = await adminStaffService.getAllDoctorsByDepartment();

  res.status(200).json({
    isSuccess: true,
    message: 'all doctors by department',
    data: doctors,
  });
});

const getAllReceptionists = catchAsync(async (req, res) => {
  const receptionists = await adminStaffService.getAllReceptionists();

  res.status(200).json({
    isSuccess: true,
    message: 'all receptionists',
    data: receptionists,
  });
});

const deActivateDoctor = catchAsync(async (req, res) => {
  const doctor = await adminStaffService.deActivateDoctor(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'doctor deactivated',
    data: doctor,
  });
});

const activateDoctor = catchAsync(async (req, res) => {
  const doctor = await adminStaffService.activateDoctor(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'doctor activated',
    data: doctor,
  });
});

const deActivateReceptionist = catchAsync(async (req, res) => {
  const receptionist = await adminStaffService.deActivateReceptionist(
    req.params,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'receptionist deactivated',
    data: receptionist,
  });
});

const activateReceptionist = catchAsync(async (req, res) => {
  const receptionist = await adminStaffService.deActivateReceptionist(
    req.params,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'receptionist activated',
    data: receptionist,
  });
});

const getAllStaffWithPendingProfiles = catchAsync(async (req, res) => {
  const users = await adminStaffService.getAllStaffWithPendingProfiles(
    req.query,
  );

  res.status(200).json({
    isSuccess: true,
    message: `panding ${req.query.role}'s`,
    data: users,
  });
});

const deletePendingStaff = catchAsync(async (req, res) => {
  await adminStaffService.deletePendingStaff(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'deleted staff member',
  });
});

module.exports = {
  getAllDoctorsByDepartment,
  getAllReceptionists,
  deActivateDoctor,
  activateDoctor,
  deActivateReceptionist,
  activateReceptionist,
  getAllStaffWithPendingProfiles,
  deletePendingStaff,
};