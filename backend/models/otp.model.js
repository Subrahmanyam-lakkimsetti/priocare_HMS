const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { type } = require('../api/v1/appointments/appointment.validation');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address, invalid email : {VALUE}',
    },
  },

  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600,
  },
});

otpSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) return;

  this.otp = await bcrypt.hash(this.otp, 10);
});

otpSchema.methods.verifyOtp = async function (userProvidedOtp) {
  return await bcrypt.compare(userProvidedOtp, this.Otp);
};

const Otp = mongoose.model('otp', otpSchema);

module.exports = Otp;
