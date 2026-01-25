const { registerUser } = require('./auth.service');

const patientRegisterController = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    console.log("Registered User:", user);

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports = {
  patientRegisterController,
};
