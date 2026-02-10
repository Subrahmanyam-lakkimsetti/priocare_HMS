const Joi = require('joi');

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const appointmentValidationSchema = Joi.object({
  scheduledDate: Joi.date().required(),
  scheduledData: Joi.string().pattern(timeRegex).required(),
  triage: Joi.object({
    symptoms: Joi.array().items(Joi.string().trim().min(1)).required(),
    vitals: Joi.object({
      heartRate: Joi.number().optional(),
      bloodPressure: Joi.string().optional(),
      temperature: Joi.number().optional(),
    }),
    comorbidities: Joi.array().items(Joi.string().trim()).optional(),
    age: Joi.number().required(),
    description: Joi.string(),
  }),
});

module.exports = appointmentValidationSchema;
