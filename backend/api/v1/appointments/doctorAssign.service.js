const Appointment = require('../../../models/appointment.model');
const Doctor = require('../../../models/doctor.model');
const AppError = require('../../../utils/AppError.util');

const getDay = (date) => {
  return new Date(date).toLocaleDateString('us-en', { weekday: 'short' });
};

const calculateTotalAppointments = async (doctor, date) => {
  return await Appointment.countDocuments({
    doctorId: doctor._id,
    scheduledDate: date,
  });
};

const assignDoctor = async ({ specilization, scheduledDate }) => {
  const doctors = await Doctor.find({
    isActive: true,
    availabilityStatus: 'available',
    specializations: { $in: [specilization] },
  });

  // for checking doctor is available or not on that day
  const appointmentDay = getDay(scheduledDate);

  let selectedDoctor = null;
  let bestScore = Infinity;

  for (let doctor of doctors) {
    // check availability
    const isAvailable = doctor.availableDays.includes(appointmentDay);
    if (!isAvailable) continue;

    const load = await calculateTotalAppointments(doctor, scheduledDate);
    if (load >= doctor.MaxDailyAppointments) continue;

    if (load < bestScore) {
      selectedDoctor = doctor;
      bestScore = load;
    }
  }

  if (!selectedDoctor) {
    throw new AppError('No doctor Found!', 404);
  }

  return selectedDoctor;
};

module.exports = assignDoctor;
