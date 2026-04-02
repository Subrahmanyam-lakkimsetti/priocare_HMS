const mongoose = require('mongoose');

const medicineScheema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  genericName: { type: String },
  category: { type: String },
  stockCount: { type: Number, default: 0 },
  unit: { type: String, default: 'tablets' },
  isAvailable: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now },
});

const Medicine = mongoose.model('medicine', medicineScheema);

module.exports = Medicine;
