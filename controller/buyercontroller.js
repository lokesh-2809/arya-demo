const Buyer = require("../models/buyer");
const UniqueId = require("../models/uniqueId");

// Create Buyer with Unique buyerId generation
const createBuyer = async (req, res) => {
  try {
    console.log("📩 Buyer Request Body:", req.body);

    const uniqueRule = await UniqueId.findOne({ name: /^buyer$/i, status: "ACTIVE" });
    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Buyer" });
    }

    const newSeq = uniqueRule.currentSequence + 1;
    const buyerId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    uniqueRule.currentSequence = newSeq;
    await uniqueRule.save();

    const buyer = await Buyer.create({ ...req.body, buyerId });
    res.status(201).json(buyer);
  } catch (error) {
    console.error("❌ Error creating buyer:", error?.message);
    console.log("Full Error:", error);
    res.status(500).json({ message: "Error creating buyer", error });
  }
};


// Get all buyers with pagination and filters
const getBuyers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;

    const queryParts = [];

    if (search) {
      queryParts.push({ buyerName: { $regex: search, $options: "i" } });
    }

    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        queryParts.push({ [key]: { $regex: value, $options: "i" } });
      }
    }

    const query = queryParts.length ? { $and: queryParts } : {};

    const total = await Buyer.countDocuments(query);
    const buyers = await Buyer.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ buyers, total });
  } catch (error) {
    console.error("Error fetching buyers:", error);
    res.status(500).json({ message: "Error fetching buyers", error: error.message });
  }
};

// Get single buyer by ID
const getBuyerById = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.params.id);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });
    res.json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buyer", error: error.message });
  }
};

// Update buyer by ID
const updateBuyer = async (req, res) => {
  try {
    const updated = await Buyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating buyer", error: error.message });
  }
};

// Delete buyer by ID
const deleteBuyer = async (req, res) => {
  try {
    await Buyer.findByIdAndDelete(req.params.id);
    res.json({ message: "Buyer deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting buyer", error: error.message });
  }
};

module.exports = {
  createBuyer,
  getBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer,
};
