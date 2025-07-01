import mongoose from "mongoose";

const shipperSchema = new mongoose.Schema({
  shipperName: String,
  phoneContact: String,
  emailContact: String,
  streetAddress: String,
  state: String,
  country: String,
  postCode: String,
  pointOfLoading: String,
  status: String,
});

const Shipper = mongoose.model("Shipper", shipperSchema);
export default Shipper;
