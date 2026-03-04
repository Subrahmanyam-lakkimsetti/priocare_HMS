const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'receptionist', 'patient', 'lab_tech'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  passwordResetToken: String,
  passwordResetTokenExpireTime: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  // Hash the password before saving the user document
  if (!this.isModified('password')) return;

  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
});

userSchema.methods.comparePasswords = async function (userprovidedPassword) {
  return await bcrypt.compare(userprovidedPassword, this.password);
};

userSchema.methods.generateResetPasswordToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hashedResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetToken = hashedResetToken;
  this.passwordResetTokenExpireTime = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('user', userSchema);

module.exports = User;
