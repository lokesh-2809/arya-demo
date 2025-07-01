const FarmerContract = require("../models/FarmerContract");

exports.createFarmerContract = async (req, res) => {
  try {
    const data = new FarmerContract(req.body);
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFarmerContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", ...filters } = req.query;
    const query = {
      $and: [
        ...Object.entries(filters).map(([k, v]) => ({ [k]: new RegExp(v, "i") })),
        search
          ? {
              $or: [
                { farmerContractId: new RegExp(search, "i") },
                { farmerName: new RegExp(search, "i") },
                { phoneContact: new RegExp(search, "i") },
              ],
            }
          : {},
      ].filter(Boolean),
    };

    const total = await FarmerContract.countDocuments(query);
    const data = await FarmerContract.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ total, contracts: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFarmerContractById = async (req, res) => {
  try {
    const data = await FarmerContract.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateFarmerContract = async (req, res) => {
  try {
    const updated = await FarmerContract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFarmerContract = async (req, res) => {
  try {
    await FarmerContract.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
