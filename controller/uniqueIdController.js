const UniqueId = require("../models/uniqueId");

exports.createUniqueId = async (req, res) => {
  try {
    const newId = new UniqueId(req.body);
    await newId.save();
    res.status(201).json(newId);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.getUniqueIds = async (req, res) => {
  const { page = 1, limit = 10, search = "", ...filters } = req.query;
  const filterObj = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
  const searchQuery = search
    ? {
        $or: [
          { name: new RegExp(search, "i") },
          { formId: new RegExp(search, "i") },
          { prefix: new RegExp(search, "i") },
          { suffix: new RegExp(search, "i") },
        ],
      }
    : {};

  const finalQuery = { ...filterObj, ...searchQuery };
  const records = await UniqueId.find(finalQuery)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  const total = await UniqueId.countDocuments(finalQuery);
  res.json({ records, total });
};

exports.getUniqueIdById = async (req, res) => {
  const record = await UniqueId.findById(req.params.id);
  if (!record) return res.status(404).json({ message: "Not found" });
  res.json(record);
};

exports.updateUniqueId = async (req, res) => {
  const updated = await UniqueId.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteUniqueId = async (req, res) => {
  await UniqueId.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
