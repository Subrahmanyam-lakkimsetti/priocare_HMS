const Joi = require('joi');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const doctorValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  specialization: Joi.string().required(),
  department: Joi.string().required(),
  specializations: Joi.array().items(Joi.string().trim()).min(1).required(),
  department: Joi.string().required(),
  experienceYears: Joi.number().required(),
  consultationFee: Joi.number().min(50).required(),
  availabilityStatus: Joi.string().required(),
  workingHours: Joi.object({
    start: Joi.string().pattern(timeRegex).required(),
    end: Joi.string().pattern(timeRegex).required(),
  }),
  availableDays: Joi.array().items(Joi.string().trim()).min(1).required(),
});

module.exports = {
  doctorValidationSchema,
};
