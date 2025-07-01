// packerController.js
const Packer = require("../models/packer");
const UniqueId = require("../models/uniqueId");

// Create
exports.createPacker = async (req, res) => {
  try {
    const uniqueRule = await UniqueId.findOne({ name: "Packer", status: "ACTIVE" });
    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Packer" });
    }

    const newSeq = parseInt(uniqueRule.currentSequence || uniqueRule.startSequence || "0") + 1;
    const packerId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    uniqueRule.currentSequence = String(newSeq);
    await uniqueRule.save();

    const packer = new Packer({
      ...req.body,
      packerId,
    });
    const saved = await packer.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create Packer Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get All (filter + search + pagination)
exports.getAllPackers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      packerId = "",
      packerName = "",
      phone = "",
      email = "",
      street = "",
      state = "",
      postCode = "",
      country = "",
      status = ""
    } = req.query;

    const query = {
      ...(packerId && { packerId: { $regex: packerId, $options: "i" } }),
      ...(packerName && { packerName: { $regex: packerName, $options: "i" } }),
      ...(phone && { phone: { $regex: phone, $options: "i" } }),
      ...(email && { email: { $regex: email, $options: "i" } }),
      ...(street && { street: { $regex: street, $options: "i" } }),
      ...(state && { state: { $regex: state, $options: "i" } }),
      ...(postCode && { postCode: { $regex: postCode, $options: "i" } }),
      ...(country && { country: { $regex: country, $options: "i" } }),
      ...(status && { status }),

      ...(search && {
        $or: [
          { packerId: { $regex: search, $options: "i" } },
          { packerName: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { state: { $regex: search, $options: "i" } },
        ]
      }),
    };

    const total = await Packer.countDocuments(query);
    const packers = await Packer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({ packers, total });
  } catch (err) {
    console.error("Get Packers Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get by ID
exports.getPackerById = async (req, res) => {
  try {
    const packer = await Packer.findById(req.params.id);
    if (!packer) return res.status(404).json({ message: "Packer not found" });
    res.json(packer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updatePacker = async (req, res) => {
  try {
    const updated = await Packer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Packer not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deletePacker = async (req, res) => {
  try {
    const deleted = await Packer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Packer not found" });
    res.json({ message: "Packer deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};