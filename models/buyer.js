const mongoose = require("mongoose");

const buyerSchema = new mongoose.Schema({
  buyerId: { type: String, required: false, unique: true },
  buyerName: { type: String, required: true },
  brokerName: String,
  phone: String,
  email: String,
  addressLine1: String,
  addressLine2: String,
  addressLine3: String,
  city: String,
  state: String,
  postCode: String,
  country: String,
  portOfDisembarkation: String,
  bankDetails: String,
  fssai: String,
  iecNo: String,
  panNo: String,
  gstNo: String,
  eximCode: String,
  pan: String,
  buyerNotes: String,
  status: String,
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Buyer", buyerSchema);
