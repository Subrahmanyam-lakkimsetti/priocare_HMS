const { verify } = require('jsonwebtoken');
const AppError = require('../utils/AppError.util');
const { verifyToken } = require('../utils/jwt.util');
const catchAsync = require('../utils/catchAsync.util');

const authMiddleware = catchAsync((req, res, next) => {
  // access the token
  const token = req.cookies.accessToken;
  console.log('token ', token);

  // ckeck if token exists
  if (!token) {
    return next(new AppError('unauthorized', 401));
  }

  // verify and decode the token
  const decode = verifyToken(token);
  console.log(decode);

  // add the payold data tot the req obj
  req.data = {
    id: decode.userId,
    role: decode.role,
  };

  next();
});

module.exports = {
  authMiddleware,
};
