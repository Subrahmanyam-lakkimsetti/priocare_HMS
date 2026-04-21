const Joi = require('joi');

const askAssistantValidationSchema = Joi.object({
  question: Joi.string().trim().min(2).max(2000).required(),
  conversationId: Joi.string().length(24).hex().optional(),
  appointmentId: Joi.string().length(24).hex().optional(),
  intent: Joi.string()
    .valid(
      'general',
      'appointment',
      'prescription',
      'intake',
      'navigation',
      'other',
    )
    .optional(),
  pageContext: Joi.string().trim().max(80).optional(),
  currentIntake: Joi.object({
    description: Joi.string().trim().max(2000).allow('').optional(),
    symptoms: Joi.array().items(Joi.string().trim().min(1)).optional(),
    comorbidities: Joi.array().items(Joi.string().trim().min(1)).optional(),
    vitals: Joi.object({
      heartRate: Joi.string().trim().allow('').optional(),
      bloodPressure: Joi.string().trim().allow('').optional(),
      temperature: Joi.string().trim().allow('').optional(),
    }).optional(),
    age: Joi.string().trim().allow('').optional(),
    scheduledDate: Joi.string().trim().allow('').optional(),
  }).optional(),
});

const escalateAssistantValidationSchema = Joi.object({
  conversationId: Joi.string().length(24).hex().required(),
  reason: Joi.string().trim().min(3).max(300).required(),
  targetRole: Joi.string().valid('doctor', 'receptionist').required(),
});

const resolveEscalationValidationSchema = Joi.object({
  resolutionNote: Joi.string().trim().min(3).max(500).optional(),
});

const intakeAutofillValidationSchema = Joi.object({
  description: Joi.string().trim().min(5).max(2000).required(),
  symptoms: Joi.array().items(Joi.string().trim().min(1)).optional(),
  comorbidities: Joi.array().items(Joi.string().trim().min(1)).optional(),
  vitals: Joi.object({
    heartRate: Joi.string().trim().optional(),
    bloodPressure: Joi.string().trim().optional(),
    temperature: Joi.string().trim().optional(),
  }).optional(),
  age: Joi.string().trim().optional(),
});

const intakeFromChatValidationSchema = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid('patient', 'assistant', 'system').required(),
        content: Joi.string().trim().min(1).max(2000).required(),
        intent: Joi.string().trim().max(40).optional(),
        confidence: Joi.any().optional(),
        safetyNotice: Joi.any().optional(),
        meta: Joi.object().optional(),
        createdAt: Joi.any().optional(),
      }).unknown(true),
    )
    .min(1)
    .max(30)
    .required(),
  currentIntake: Joi.object({
    description: Joi.string().trim().max(2000).optional(),
    symptoms: Joi.array().items(Joi.string().trim().min(1)).optional(),
    comorbidities: Joi.array().items(Joi.string().trim().min(1)).optional(),
    vitals: Joi.object({
      heartRate: Joi.string().trim().optional(),
      bloodPressure: Joi.string().trim().optional(),
      temperature: Joi.string().trim().optional(),
    }).optional(),
    age: Joi.string().trim().optional(),
  }).optional(),
});

module.exports = {
  askAssistantValidationSchema,
  escalateAssistantValidationSchema,
  resolveEscalationValidationSchema,
  intakeAutofillValidationSchema,
  intakeFromChatValidationSchema,
};
