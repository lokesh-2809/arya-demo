const mongoose = require("mongoose");

const uniqueIdSchema = new mongoose.Schema({
  name: { type: String, required: true },
  formId: { type: String, required: true, unique: true },
  prefix: String,
  startSequence: String,
  currentSequence: String,
  suffix: String,
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
});

module.exports = mongoose.model("UniqueId", uniqueIdSchema);
