const Joi = require('joi');

const patientvalidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  age: Joi.number().min(0).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  phoneNumber: Joi.string().min(10).max(10).required(),
  address: Joi.string().required(),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .required(),
  insuranceDetails: Joi.string().optional(),
});

module.exports = {
  patientvalidationSchema,
};
