import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
  farmerId: { type: String, required: false },
  farmerName: { type: String, required: true },
  phone: String,
  email: String,
  street: String,
  state: String,
  postCode: String,
  country: String,
  products: String,
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
}, { timestamps: true });

export default mongoose.model("Farmer", farmerSchema);
