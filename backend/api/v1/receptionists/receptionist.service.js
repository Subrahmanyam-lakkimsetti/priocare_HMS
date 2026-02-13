const Appointment = require('../../../models/appointment.model');
const AppError = require('../../../utils/AppError.util');

const patientCheckin = async ({ token }) => {
  const appointment = await Appointment.findOne({ token });

  if (!appointment) {
    throw new AppError('No appointment found!', 404);
  }

  if (appointment.status !== 'confirmed') {
    throw new AppError(`Check-in not allowed for ${appointment.status} patients`);
  }

  appointment.status = 'checked_in';
  appointment.checkedInAt = new Date();

  appointment.save();

  return appointment;
  // const appointment = await Appointment.findOneAndUpdate(
  //   { token, status: 'confirmed' },
  //   {
  //     $set: { status: 'checked_in' },
  //     $currentDate: { checkedInAt: true },
  //   },
  //   { new: true },
  // );

  // if (!appointment) {
  //   throw new AppError('No appointment found', 404);
  // }

  // return appointment;
};

module.exports = { patientCheckin };
