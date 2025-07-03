// import Seller from "../models/seller.js"; // ✅ ADD `.js` extension
const Seller = require("../models/seller"); // ✅ ADD `.js` extension

// CREATE
export const createSeller = async (req, res) => {
  try {
    const newSeller = new Seller(req.body);
    const saved = await newSeller.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL with optional filters & pagination
// GET ALL SELLERS with filters + pagination + global search
export const getSellers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;

    // Remove empty filter fields
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v?.trim() !== "")
    );

    // Build MongoDB query
    const query = {};

    // Global search condition on sellerId and sellerName
    if (search.trim() !== "") {
      query.$or = [
        { sellerId: { $regex: search, $options: "i" } },
        { sellerName: { $regex: search, $options: "i" } },
      ];
    }

    // Add each filter field to query
    for (const [key, value] of Object.entries(cleanedFilters)) {
      query[key] = { $regex: value, $options: "i" }; // case-insensitive partial match
    }

    const total = await Seller.countDocuments(query);
    const sellers = await Seller.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ sellers, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ SINGLE
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    res.json(seller);
  } catch (err) {
    res.status(404).json({ error: "Seller not found" });
  }
};

// UPDATE
export const updateSeller = async (req, res) => {
  try {
    const updated = await Seller.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
export const deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
