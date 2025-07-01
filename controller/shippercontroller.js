import Shipper from "../models/shipper.js";

// Create
export const createShipper = async (req, res) => {
  try {
    const shipper = await Shipper.create(req.body);
    
    res.status(201).json({ message: "Shipper created", shipper });
  } catch (err) {
    res.status(500).json({ message: "Error creating shipper", error: err.message });
  }
};

// Read All (with filters, global search, pagination)
export const getShippers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      global = "",
      ...filters
    } = req.query;

    const query = {};

    for (let key in filters) {
      if (filters[key]) {
        query[key] = { $regex: filters[key], $options: "i" };
      }
    }

    if (global) {
      query.shipperName = { $regex: global, $options: "i" };
    }

    const shippers = await Shipper.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));


    const total = await Shipper.countDocuments(query);

    res.status(200).json({ shippers, total });
  } catch (err) {
    res.status(500).json({ message: "Error fetching shippers", error: err.message });
  }
};

// Read One
export const getShipperById = async (req, res) => {
  try {
    const shipper = await Shipper.findById(req.params.id);
    if (!shipper) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json(shipper);
  } catch (err) {
    res.status(500).json({ message: "Error fetching shipper", error: err.message });
  }
};

// Update
export const updateShipper = async (req, res) => {
  try {
    const updated = await Shipper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json({ message: "Shipper updated", shipper: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating shipper", error: err.message });
  }
};

// Delete
export const deleteShipper = async (req, res) => {
  try {
    const deleted = await Shipper.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Shipper not found" });
    res.status(200).json({ message: "Shipper deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting shipper", error: err.message });
  }
};
