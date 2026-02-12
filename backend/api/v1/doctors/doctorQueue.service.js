const Appointment = require('../../../models/appointment.model');
const { getDayRange } = require('../../../utils/dayRange.util');
const {
  calculateEffectivePriority,
} = require('../../../utils/effectivePriority.util');

AVG_CONSULT_MIN = 20;
const getDoctorQueue = async (doctorId, scheduledDate) => {
  const { start, end } = getDayRange(scheduledDate);

  const clinicStartTime = new Date(scheduledDate);
  clinicStartTime.setHours(9, 0, 0, 0);

  const queue = await Appointment.find({
    doctorId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['checked_in'] },
  });

  queue.sort(
    (a, b) =>
      calculateEffectivePriority(b, clinicStartTime) -
      calculateEffectivePriority(a, clinicStartTime),
  );

  return queue.map((appointment, index) => {
    const est = new Date(clinicStartTime);
    est.setMinutes(est.getMinutes() + index * AVG_CONSULT_MIN);

    console.log(est);

    return {
      ...appointment.toObject(),
      queuePosition: index + 1,
      effectiveScore: calculateEffectivePriority(appointment, clinicStartTime),
      exceptedStartTime: est.toLocaleDateString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  });
};

module.exports = {
  getDoctorQueue,
};
