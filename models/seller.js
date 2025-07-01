import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
  sellerId: String,
  sellerName: String,
  product: String,
  brokerName: String,
  phoneContact: String,
  emailContact: String,
  streetAddress: String,
  state: String,
  postCode: String,
  country: String,
  dctPortName: String,
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, {
  timestamps: true,
});

export default mongoose.models.Seller || mongoose.model("Seller", SellerSchema);
