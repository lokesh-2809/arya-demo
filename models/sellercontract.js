// ==== models/SellerContract.js ====
const mongoose = require("mongoose");

const sellerContractSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
    unique: true
  },
  streetAddress: String,
  state: String,
  country: String,
  postCode: String,
  emailContact: String,
  phoneContact: String,
  dctPort: String,
  broker: String,
  brokerContractId: String,
  productSelection: String,
  product: String,
  grading: String,
  specValue: String,
  bidDate: String,
  bidPrice: String,
  sellDate: String,
  sellPrice: String,
  sellQuantityT: String,
  sellQuantityC: String,
  allocatedC: String,
  balanceC: String,
  monthOfShipment: String,
  status: {
    type: String,
    enum: ["ACTIVE", "INACTIVE", "FULFILLED"],
    default: "ACTIVE"
  },
  uploadDocument: String
}, {
  timestamps: true
});

module.exports = mongoose.model("SellerContract", sellerContractSchema);