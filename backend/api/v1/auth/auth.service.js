const User = require('../../../models/user.scheema');
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

  newUser.password = undefined;

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
    throw new AppError('Account is inActive, contact support.', 403);
  }

  // generate and send token
  const token = generateToken({
    userId: user.id,
    role: user.role,
  });

  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
