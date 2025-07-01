const mongoose = require("mongoose");

const freightForwarderSchema = new mongoose.Schema({
  packerId: String,
  packerName: String,
  freightforwarder: String,
  phone: String,
  email: String,
  street: String,
  state: String,
  postCode: String,
  country: String,
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE"],
    default: "ACTIVE"
  },
}, { timestamps: true });

module.exports = mongoose.model("FreightForwarder", freightForwarderSchema);
