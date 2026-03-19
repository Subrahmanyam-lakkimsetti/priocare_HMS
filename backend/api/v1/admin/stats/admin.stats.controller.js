const catchAsync = require('../../../../utils/catchAsync.util');
const adminStatsService = require('./admin.stats.service');

const getStats = catchAsync(async (req, res) => {
  const stats = await adminStatsService.getStats();

  res.status(200).json({
    isSuccess: true,
    message: 'admin stats',
    data: stats,
  });
});

const getTodayStats = catchAsync(async (req, res) => {
  const todayStats = await adminStatsService.getTodayStats(req.query);

  res.status(200).json({
    isSuccess: true,
    message: 'today stats',
    data: todayStats,
  });
});

module.exports = {
  getStats,
  getTodayStats,
};