const catchAsync = require('../../../utils/catchAsync.util');
const receptionistService = require('./receptionstAuth.service');

const createReceptionistController = catchAsync(async (req, res) => {
  const receptionist = await receptionistService.createReceptionist(
    req.data.id,
    req.body,
    req.file,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'profile created successfully',
    data: receptionist,
  });
});

const getReceptionists = catchAsync(async (req, res) => {
  const receptionists = await receptionistService.getReceptionists();

  res.status(200).json({
    isSuccess: true,
    message: 'list of all receptionists',
    data: receptionists,
  });
});

const getReceptionist = catchAsync(async (req, res) => {
  const receptionist = await receptionistService.getReceptionist(req.params);

  res.status(200).json({
    isSuccess: true,
    message: 'receptionist details',
    data: receptionist,
  });
});

const updateReceptionist = catchAsync(async (req, res) => {
  const receptionist = await receptionistService.updateReceptionist(
    req.params.id,
    req.body,
    req.file,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'details updated successfully',
    data: receptionist,
  });
});

const getMe = catchAsync(async (req, res) => {
  const receptionist = await receptionistService.getMe(req.data.id);

  res.status(200).json({
    isSuccess: true,
    message: 'your profile details',
    data: receptionist,
  });
});

module.exports = {
  createReceptionistController,
  getReceptionists,
  getReceptionist,
  updateReceptionist,
  getMe,
};
