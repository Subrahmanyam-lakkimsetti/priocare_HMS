const Joi = require('joi');

const doctorSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = {
  doctorSchema,
};
