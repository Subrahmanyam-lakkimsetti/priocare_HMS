const catchAsync = require('../../../utils/catchAsync.util');
const { getDoctorQueue } = require('./doctorQueue.service');

const getQueue = catchAsync(async (req, res) => {
  const { doctorId } = req.params;
  const { date } = req.query;

  const queue = await getDoctorQueue(doctorId, date);

  res.status(200).json({
    isSuccess: true,
    message: `Queue for ${date}`,
    data: queue,
  });
});

module.exports = getQueue;
