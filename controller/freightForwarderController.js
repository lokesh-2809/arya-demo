const FreightForwarder = require("../models/freightForwarder");

exports.createFreightForwarder = async (req, res) => {
  try {
    const data = req.body;
    const record = await FreightForwarder.create(data);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFreightForwarders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;
    const skip = (page - 1) * limit;

    const searchFilter = search
      ? {
          $or: [
            { packerId: { $regex: search, $options: "i" } },
            { packerName: { $regex: search, $options: "i" } },
            { freightforwarder: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const finalFilter = {
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = new RegExp(value, "i");
        return acc;
      }, {}),
      ...searchFilter,
    };

    const total = await FreightForwarder.countDocuments(finalFilter);
    const freightforwarders = await FreightForwarder.find(finalFilter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ freightforwarders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFreightForwarderById = async (req, res) => {
  try {
    const record = await FreightForwarder.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFreightForwarder = async (req, res) => {
  try {
    const record = await FreightForwarder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: "Not found" });
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteFreightForwarder = async (req, res) => {
  try {
    await FreightForwarder.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
