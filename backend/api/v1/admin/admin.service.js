const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const { generateToken } = require('../../../utils/jwt.util');

const createDoctorUser = async ({ email, password }) => {
  // check existing user with email
  const isDoctorExists = await User.findOne({ email });

  if (isDoctorExists) {
    throw new AppError('Doctor already exists', 409);
  }

  // if not create new one
  const doctor = User.create({
    email,
    password,
    role: 'doctor',
  });

  return doctor;
};

module.exports = {
  createDoctorUser,
};
