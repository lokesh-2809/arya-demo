// models/countryModel.js
const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  countryName: String,
  countryCode: String
});

module.exports = mongoose.model("Country", countrySchema);
