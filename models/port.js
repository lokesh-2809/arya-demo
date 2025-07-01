const mongoose = require("mongoose");

const portSchema = new mongoose.Schema({
  portId: { type: String },
  portName: { type: String, required: true },
  country: { type: String },
  address: { type: String },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });

module.exports = mongoose.model("Port", portSchema);
