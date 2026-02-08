const Joi = require('joi');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const doctorValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  department: Joi.string().required(),
  specializations: Joi.array().items(Joi.string().trim()).min(1).required(),
  experienceYears: Joi.number().min(0).required(),
  consultationFee: Joi.number().min(50).required(),
  availabilityStatus: Joi.string().required(),
  workingHours: Joi.object({
    start: Joi.string().pattern(timeRegex).required(),
    end: Joi.string().pattern(timeRegex).required(),
  }).required(),
  availableDays: Joi.array().items(Joi.string().trim()).min(1).required(),
});

const updateDoctorValidationSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  specializations: Joi.array().items(Joi.string().trim().min(1)),
  department: Joi.string(),
  experienceYears: Joi.number().min(0),
  consultationFee: Joi.number().min(50),
  availabilityStatus: Joi.string().valid('available', 'unavailable'),
  workingHours: Joi.object({
    start: Joi.string().pattern(timeRegex),
    end: Joi.string().pattern(timeRegex),
  }),
  availableDays: Joi.array().items(
    Joi.string()
      .valid('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
      .trim()
      .min(1),
  ),
}).min(1);

module.exports = {
  doctorValidationSchema,
  updateDoctorValidationSchema,
};
