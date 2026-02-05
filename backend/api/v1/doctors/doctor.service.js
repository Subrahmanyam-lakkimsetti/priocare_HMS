const Doctor = require('../../../models/doctor.model');
const AppError = require('../../../utils/AppError.util');

const createDoctor = async (userId, payload) => {
  // check is Exists
  const isDoctorExists = await Doctor.findOne({ userId });

  if (isDoctorExists) {
    throw new AppError('profile already exists', 409);
  }

  const doctorProfile = Doctor.create({
    userId,
    ...payload,
  });

  return doctorProfile;
};

module.exports = {
  createDoctor,
};
