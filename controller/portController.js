const Port = require("../models/port");

exports.createPort = async (req, res) => {
  console.log("Incoming body:", req.body); // Debug
  try {
    const { portName, country } = req.body;
    if (!portName || !country) {
      return res.status(400).json({ message: "portName and country are required" });
    }
    const newPort = new Port(req.body);
    const saved = await newPort.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating port:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllPorts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;

    const query = {
      ...(filters.portId && { portId: new RegExp(filters.portId, "i") }),
      ...(filters.portName && { portName: new RegExp(filters.portName, "i") }),
      ...(filters.country && { country: new RegExp(filters.country, "i") }),
      ...(filters.address && { address: new RegExp(filters.address, "i") }),
      ...(filters.status && { status: filters.status }),
    };

    if (search) {
      query.$or = [
        { portId: new RegExp(search, "i") },
        { portName: new RegExp(search, "i") },
        { country: new RegExp(search, "i") },
        { address: new RegExp(search, "i") },
        { status: new RegExp(search, "i") },
      ];
    }

    const ports = await Port.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Port.countDocuments(query);

    res.json({ ports, total });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ports", error: err.message });
  }
};

exports.getPortById = async (req, res) => {
  try {
    const port = await Port.findById(req.params.id);
    if (!port) return res.status(404).json({ message: "Port not found" });
    res.json(port);
  } catch (err) {
    res.status(500).json({ message: "Error fetching port", error: err.message });
  }
};

exports.updatePort = async (req, res) => {
  try {
    const port = await Port.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!port) return res.status(404).json({ message: "Port not found" });
    res.json(port);
  } catch (err) {
    res.status(500).json({ message: "Error updating port", error: err.message });
  }
};

exports.deletePort = async (req, res) => {
  try {
    const port = await Port.findByIdAndDelete(req.params.id);
    if (!port) return res.status(404).json({ message: "Port not found" });
    res.json({ message: "Port deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting port", error: err.message });
  }
};
