const Doctor = require('../../../models/doctor.model');

const SLOT_TIME_PER_PATIENT = 30;

const getInMinutes = (time) => {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
};

const getDay = (date) => {
  return new Date(date).toLocaleDateString('us-en', { weekday: 'short' });
};

const isWithinWorkingHours = (doctor, scheduledTime) => {
  const start = getInMinutes(doctor.workingHours.start);
  const end = getInMinutes(doctor.workingHours.end);
  const appointment_Schedule_time = getInMinutes(scheduledTime);

  return (
    appointment_Schedule_time >= start &&
    appointment_Schedule_time + SLOT_TIME_PER_PATIENT <= end
  );
};

const assignDoctor = async ({
  priorityScore,
  severityLevel,
  specilization,
  scheduledDate,
  scheduledTime,
}) => {
  const doctors = await Doctor.find({
    isActive: true,
    availabilityStatus: 'available',
    specializations: { $in: [specilization] },
  });

  // for checking doctor is available or not on that day
  const appointmentDay = getDay(scheduledDate);

  let selectedDoctor = null;
  let bestScore = -Infinity;

  doctors.forEach((doctor) => {
    console.log(doctor);

    // check availability
    const isAvailable = doctor.availableDays.includes(appointmentDay);
    if (!isAvailable) return;

    // check is doctor working on that timings that patient wants
    if (!isWithinWorkingHours(doctor, scheduledTime)) return;
  });

  if (!selectedDoctor) {
    console.log('No doctor Found');
  }
};

module.exports = assignDoctor;
