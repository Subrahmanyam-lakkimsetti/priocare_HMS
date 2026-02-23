const Appointment = require('../../../models/appointment.model');
const { getDayRange } = require('../../../utils/dayRange.util');
const {
  calculateEffectivePriority,
} = require('../../../utils/effectivePriority.util');

const AVG_CONSULT_MIN = 20;
const getDoctorQueue = async (doctorId, scheduledDate) => {
  const { start, end } = getDayRange(scheduledDate);

  const clinicStartTime = new Date(scheduledDate);
  clinicStartTime.setHours(9, 0, 0, 0);

  const queue = await Appointment.find({
    doctorId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['checked_in'] },
  });

  const calledAppointment = await Appointment.findOne({
    doctorId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['called'] },
  });

  const activeAppointment = await Appointment.findOne({
    doctorId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['in_consultation'] },
  });

  const lastAppointment = await Appointment.findOne({
    doctorId,
    scheduledDate: { $gte: start, $lte: end },
    status: { $in: ['completed'] },
  }).sort({ consulationEndsAt: -1 });

  if (
    !activeAppointment &&
    !lastAppointment &&
    !calledAppointment &&
    queue.length == 0
  ) {
    return {
      isQueueActive: false,
      message: 'Queue is empty',
    };
  }

  queue.sort(
    (a, b) =>
      calculateEffectivePriority(b, clinicStartTime) -
      calculateEffectivePriority(a, clinicStartTime),
  );

  const now = new Date();

  let doctorStartTime;

  if (calledAppointment) {
    patientCalledAt = new Date(calledAppointment.calledAt);
    patientCalledAt.setMinutes(
      patientCalledAt.getMinutes() + AVG_CONSULT_MIN + 5,
    );

    const latest = new Date(now);
    latest.setMinutes(latest.getMinutes() + AVG_CONSULT_MIN + 5);

    doctorStartTime = Math.max(patientCalledAt, latest);
  } else if (activeAppointment) {
    const appointmentEndTime = new Date(activeAppointment.consulationStartsAt);
    appointmentEndTime.setMinutes(
      appointmentEndTime.getMinutes() + AVG_CONSULT_MIN,
    );

    const latest = new Date(now);
    latest.setMinutes(latest.getMinutes() + AVG_CONSULT_MIN);

    doctorStartTime = Math.max(appointmentEndTime, latest);
  } else if (lastAppointment) {
    doctorStartTime = Math.max(lastAppointment.consulationEndsAt, now);
  } else {
    // const firstPatientArrivalTime = new Date(queue[0].checkedInAt);
    doctorStartTime = new Date(Math.max(clinicStartTime, now));
  }

  const patients = [];

  for (let i = 0; i < queue.length; i++) {
    const appt = queue[i];

    const startTime = new Date(doctorStartTime);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + AVG_CONSULT_MIN);

    patients.push({
      ...appt.toObject(),
      queuePosition: i + 1,
      exceptedStartTime: startTime.toLocaleDateString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      exceptedEndTime: endTime.toLocaleDateString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });

    doctorStartTime = endTime;
  }

  return {
    isQueueActive: true,
    message: 'patients queue',
    patients,
  };
};

module.exports = {
  getDoctorQueue,
};
