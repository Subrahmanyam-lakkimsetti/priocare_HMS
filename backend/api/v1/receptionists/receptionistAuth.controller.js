const catchAsync = require('../../../utils/catchAsync.util');
const receptionistService = require('./receptionstAuth.service');

const createReceptionistController = catchAsync(async (req, res) => {
  const receptionist = await receptionistService.createReceptionist(
    req.data.id,
    req.body,
  );

  res.status(200).json({
    isSuccess: true,
    message: 'profile created successfully',
    date: receptionist,
  });
});



module.exports = {
  createReceptionistController,
};
