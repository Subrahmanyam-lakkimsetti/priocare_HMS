const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');

const createDoctorUser = async ({ email }) => {
  // check existing user with email
  const isDoctorExists = await User.findOne({ email });

  if (isDoctorExists) {
    throw new AppError('Doctor already exists', 409);
  }

  // if not create new one
  const doctor = User.create({
    email,
    password: "123456",
    role: 'doctor',
  });

  return doctor;
};

module.exports = {
  createDoctorUser,
};
