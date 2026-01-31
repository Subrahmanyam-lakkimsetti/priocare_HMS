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

const updatePatientValidationSchema = Joi.object({
  firstName: Joi.string(),
  lastname: Joi.string(),
  age: Joi.number().min(0),
  gender: Joi.string().valid('male', 'female', 'other'),
  phoneNumber: Joi.string(),
  address: Joi.string(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  insuranceDetails: Joi.string(),
});

module.exports = {
  patientvalidationSchema,
  updatePatientValidationSchema,
};
