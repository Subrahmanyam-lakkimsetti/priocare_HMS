const {
  registerUser,
  loginUser,
  getUser,
  updatePassword,
  forgetPassword,
  resetPassword,
  sendOtpToUser,
  resendOtpToUser,
} = require('./auth.service');
const catchAsync = require('../../../utils/catchAsync.util');
const { UserDTO } = require('./auth.dto');
const { setCookie } = require('../../../utils/cookie.util');

const sendOtp = catchAsync(async (req, res) => {
  await sendOtpToUser(req.body);

  res.status(200).json({
    isSucess: true,
    message: 'otp send sucessfully',
  });
});

const resendOtp = catchAsync(async (req, res) => {
  await resendOtpToUser(req.body);

  res.status(200).json({
    isSuccess: true,
    message: 'otp resend sucessfully',
  });
});

const patientRegisterController = catchAsync(async (req, res) => {
  // get the request
  const { newUser: user, token } = await registerUser(req.body);

  setCookie(res, token);

  // send back the response
  res.status(201).json({
    isSuccess: true,
    message: 'User registered successfully',
    data: new UserDTO(user),
  });
});

const loginController = catchAsync(async (req, res) => {
  const { user, token } = await loginUser(req.body);

  setCookie(res, token);

  res.status(200).json({
    isSuccess: true,
    message: 'login successful',
    data: new UserDTO(user),
  });
});

const logoutController = catchAsync((req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // true in production
  });

  res.status(200).json({
    isSuccess: true,
    message: 'logout sucessfully',
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = await getUser(req.data);

  res.status(200).json({
    isSuccess: true,
    data: user,
  });
});

const updatePasswordController = catchAsync(async (req, res) => {
  await updatePassword(req.body, req.data);

  res.status(200).json({
    isSuccess: true,
    message: 'password updated successfully',
  });
});

const forgetPasswordController = catchAsync(async (req, res) => {
  const url = await forgetPassword(req);

  res.status(200).json({
    isSuccess: true,
    message: 'password reset mail sent successful',
    data: {
      url,
    },
  });
});

const resetPasswordController = catchAsync(async (req, res) => {
  await resetPassword(req.params.resettoken, req.body.newPassword);

  res.status(200).json({
    isSuccess: true,
    message: 'password sucessfully changed',
  });
});

module.exports = {
  sendOtp,
  resendOtp,
  patientRegisterController,
  loginController,
  logoutController,
  getMe,
  updatePasswordController,
  forgetPasswordController,
  resetPasswordController,
};
