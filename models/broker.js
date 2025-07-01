const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema({
 brokerId: {
      type: String,
      required: false,
      unique: true, // ensure brokerId is unique
    },
  brokerName: String,
  phoneContact: String,
  emailContact: String,
  streetAddress: String,
  state: String,
  postcode: String,
  country: String,
  typeOfReferral: String,
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
}, { timestamps: true });

module.exports = mongoose.model('Broker', brokerSchema);
