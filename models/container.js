const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
   containerId: String,
  hireCompany: String,
  phoneContact: String,
  emailContact: String,
  streetAddress: String,
  state: String,
  postcode: String,
  country: String,
  containerSize: String,
  maxHoldingQuantity: Number,
  containerGrade: String,
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Container', containerSchema);
