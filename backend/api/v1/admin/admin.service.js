const { Receptionist } = require('../../../models/receptionist.model');
const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');

const createDoctorUser = async ({ email }) => {
  // check existing user with email
  const isDoctorExists = await User.findOne({ email });

  if (isDoctorExists) {
    throw new AppError('Doctor already exists', 409);
  }

  // if not create new one
  const doctor = await User.create({
    email,
    password: '123456',
    role: 'doctor',
  });

  return doctor;
};

const createReceptionist = async ({ email }) => {
  console.log(email);
  const isReceptionExists = await User.findOne({ email });

  if (isReceptionExists) {
    throw new AppError('Receptionist already exists', 409);
  }

  const receptionist = await User.create({
    email,
    password: '123456',
    role: 'receptionist',
  });

  return receptionist;
};

module.exports = {
  createDoctorUser,
  createReceptionist,
};
