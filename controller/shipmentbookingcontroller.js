// import Shipment from '../models/shipmentBooking';
const Shipment = require('../models/shipmentBooking')

// CREATE
exports.createShipmentBooking = async (req, res) => {
  try {
    const newShipment = new Shipment(req.body);
    console.log(newShipment)
    const saved = await newShipment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL with optional filters & pagination
// GET ALL SHIPMENT with filters + pagination + global search
exports.getShipment = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;

    // Remove empty filter fields
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v?.trim() !== "")
    );

    // Build MongoDB query
    const query = {};

    // Global search condition on shipmentName and shipmentBookingNumber
    if (search.trim() !== "") {
      query.$or = [
        { shipmentName: { $regex: search, $options: "i" } },
        { shipmentBookingNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Add each filter field to query
    for (const [key, value] of Object.entries(cleanedFilters)) {
      query[key] = { $regex: value, $options: "i" }; // case-insensitive partial match
    }

    const total = await Shipment.countDocuments(query);
    const shipment = await Shipment.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ shipment, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// READ SINGLE
exports.getShipmentById = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);
    res.json(shipment);
  } catch (err) {
    res.status(404).json({ error: "Shipment Booking not found" });
  }
};

// UPDATE
exports.updateShipment = async (req, res) => {
  try {
    const updated = await Shipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteShipment = async (req, res) => {
  try {
    await Shipment.findByIdAndDelete(req.params.id);
    res.json({ message: "Shipment Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
