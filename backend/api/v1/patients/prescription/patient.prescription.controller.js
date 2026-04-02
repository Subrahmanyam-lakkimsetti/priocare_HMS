const catchAsync = require('../../../../utils/catchAsync.util');
const prescriptionService = require('./patient.prescription.service');

const getPrescriptionWithStatus = catchAsync(async (req, res) => {
  const prescription = await prescriptionService.getPrescriptionWithStatus(req);

  res.status(200).json({
    isSuccess: true,
    message: 'your prescription',
    data: {
      prescription,
    },
  });
});

module.exports = {
  getPrescriptionWithStatus,
};
