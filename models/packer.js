const mongoose = require("mongoose");

const packerSchema = new mongoose.Schema({
  packerId: { type: String },
  packerName: { type: String, required: true },
  phone: String,
  email: String,
  street: String,
  state: String,
  postCode: String,
  country: String,
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });

module.exports = mongoose.model("Packer", packerSchema);
