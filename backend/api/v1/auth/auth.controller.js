const { registerUser, loginUser, getUser } = require('./auth.service');
const catchAsync = require('../../../utils/catchAsync.util');
const { UserDTO } = require('./auth.dto');

const setCookie = (res, token) => {
  const cookieOptions = {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('accessToken', token, cookieOptions);
};

const patientRegisterController = catchAsync(async (req, res) => {
  // get the request
  const { newUser: user, token } = await registerUser(req.body);

  setCookie(res, token);

  // send back the response
  res.status(201).json({
    isSuccess: true,
    message: 'User registered successfully',
    user: new UserDTO(user),
  });
});

const loginController = catchAsync(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  setCookie(res, token);

  res.status(200).json({
     isSuccess: true,
    data: new UserDTO(user),
  });
});

const logoutController = catchAsync((req, res) => {
  res.clearCookie('accessToken');

  res.status(200).json({
     isSuccess: true,
    message: 'logout sucessfully',
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await getUser(req.data);

  res.status(200).json({
    isSuccess: true,
    user,
  });
});

module.exports = {
  patientRegisterController,
  loginController,
  logoutController,
  getMe,
};
