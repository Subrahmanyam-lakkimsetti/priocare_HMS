const Joi = require('joi');

const doctorSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
});

module.exports = {
  doctorSchema,
};
