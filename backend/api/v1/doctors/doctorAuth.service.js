const Doctor = require('../../../models/doctor.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');

const normalizeSpecializations = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const createDoctor = async (userId, payload, file) => {
  if (file) {
    payload.photo = file.path;
  }

  if (payload.specializations) {
    payload.specializations = normalizeSpecializations(payload.specializations);
  }

  // check is Exists
  const isDoctorExists = await Doctor.findOne({ userId });

  if (isDoctorExists) {
    throw new AppError('profile already exists', 409);
  }

  const doctorProfile = await Doctor.create({
    userId,
    ...payload,
  });

  await User.findOneAndUpdate({ _id: userId }, { isProfileComplete: true });

  return doctorProfile;
};

const getDoctors = async () => {
  return await Doctor.find();
};

const getDoctor = async ({ id }) => {
  const doctor = await Doctor.findById(id);

  if (!doctor) {
    throw new AppError('Not found!', 404);
  }

  return doctor;
};

const updateDoctor = async (id, updateData, file) => {
  if (file) {
    updateData.photo = file.path;
  }

  if (updateData.specializations) {
    updateData.specializations = normalizeSpecializations(
      updateData.specializations,
    );
  }

  let updatedDoctor = await Doctor.findOneAndUpdate(
    { userId: id },
    updateData,
    {
      new: true,
    },
  );

  if (!updatedDoctor) {
    updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  if (!updatedDoctor) {
    throw new AppError('Not found!', 404);
  }

  // Also update the user's isProfileComplete flag
  await User.findOneAndUpdate(
    { _id: updatedDoctor.userId },
    { isProfileComplete: true },
  );

  return updatedDoctor;
};

const getMe = async (userId) => {
  const doctor = await Doctor.findOne({ userId });

  if (!doctor) {
    throw new AppError('Not found', 404);
  }

  return doctor;
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  getMe,
};
