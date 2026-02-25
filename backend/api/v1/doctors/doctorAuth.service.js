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

const updateDoctor = async (id, updateData) => {

  const updatedDoctor = await Doctor.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedDoctor) {
    throw new AppError('Not found!', 404);
  }

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
