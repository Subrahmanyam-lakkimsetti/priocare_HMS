const catchAsync = require('../../../../utils/catchAsync.util');
const DoctorPrescriptionService = require('./doctor.pres.service');

const createPrescription = catchAsync(async (req, res) => {
  const prescription = await DoctorPrescriptionService.createPrescription(req);

  res.status(200).json({
    isSuccess: true,
    message: 'preception created successfully',
    data: {
      prescription,
    },
  });
});

const updatePrescription = catchAsync(async (req, res) => {
  const updatedPrescription =
    await DoctorPrescriptionService.updatePrescription(req);

  res.status(200).json({
    isSucess: true,
    message: 'prescription updated successfully',
    data: {
      updatedPrescription,
    },
  });
});

module.exports = {
  createPrescription,
  updatePrescription,
};
