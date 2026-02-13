const { default: mongoose } = require('mongoose');

const receptionistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

const Receptionist = mongoose.model('receptionist', receptionistSchema);

module.exports = {
  Receptionist,
};
