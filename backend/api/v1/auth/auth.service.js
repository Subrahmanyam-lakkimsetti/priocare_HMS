const User = require('../../../models/user.model');
const AppError = require('../../../utils/AppError.util');
const { generateToken } = require('../../../utils/jwt.util');
const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error('User already exists with the given email');
  }

  const newUser = await User.create({
    email,
    password,
    role: 'patient',
    isActive: true,
  });

  const token = generateToken({
    userId: newUser.id,
    role: newUser.role,
  });

  return {
    newUser,
    token,
  };
};

const loginUser = async ({ email, password }) => {
  // check email and password valid or not
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePasswords(password))) {
    throw new AppError('email or password is Invalid', 404);
  }

  // check isActive
  if (!user.isActive) {
    throw new AppError('Account is inActive, please contact support.', 403);
  }

  // generate and send token
  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};

const getUser = async ({ id }) => {
  const user = await User.findById(id).select('email role isActive');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updatePassword = async ({ currentPassword, newPassword }, { id }) => {
  const currentUser = await User.findById(id);

  console.log(currentPassword);
  if (!currentUser) {
    throw new AppError('user not found', 404);
  }

  if (!(await currentUser.comparePasswords(currentPassword))) {
    throw new AppError('current password is invalid', 401);
  }

  currentUser.password = newPassword;

  currentUser.save();
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updatePassword,
};
