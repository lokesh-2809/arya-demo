// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: String,
  product: { type: String, required: true },
  type: { type: String, required: false },
  hsCode: String,
  description: String,
  countriesBuy: String,
  countriesSell: String,
  grading: String,
  specification: String,
  defectivePercentage: String,
  harvestSeason: String,
  dateCreated: String,
  dateUpdated: String,
  notes: String,
  status: String,
  origin: String,
  document: String // Optional file name
});

module.exports = mongoose.model('Product', productSchema);