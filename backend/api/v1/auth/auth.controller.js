const { registerUser } = require('./auth.service');

const catchAsync = (fn) => {
  return (req,res, next) => {
    fn(req, res, next).catch(next);
  }
}

const patientRegisterController = catchAsync(async (req, res) => {
    const user = await registerUser(req.body);

    console.log('Registered User:', user);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
      },
    });
    
});

module.exports = {
  patientRegisterController,
};
