const Joi = require('joi');

const email = Joi.string().email().required();

const registerSchema = Joi.object({
  email: email.messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Password and Confirm Password do not match',
    'any.required': 'Confirm Password is required',
  }),
}).required();

const loginScheema = Joi.object({
  email: email.messages({
    'string.email': 'please provide a valid email Address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

const updatePasswordScheema = Joi.object({
  currentPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Password and Confirm Password do not match',
      'any.required': 'confirmNewPassword is required',
    }),
}).required();

module.exports = {
  registerSchema,
  loginScheema,
  updatePasswordScheema,
};
