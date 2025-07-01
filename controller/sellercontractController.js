const SellerContract = require("../models/sellercontract");

// CREATE
exports.createSellerContract = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.uploadDocument = req.file.originalname;
    }
    const newContract = new SellerContract(data);
    await newContract.save();
    res.status(201).json(newContract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create seller contract" });
  }
};

// GET ALL (with pagination & optional search)
exports.getAllSellerContracts = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const query = search
    ? {
        $or: [
          { sellerName: new RegExp(search, "i") },
          { product: new RegExp(search, "i") },
        ]
      }
    : {};
  try {
    const total = await SellerContract.countDocuments(query);
    const contracts = await SellerContract.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    res.json({ contracts, total });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contracts" });
  }
};

// GET BY ID
exports.getSellerContractById = async (req, res) => {
  try {
    const contract = await SellerContract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: "Not found" });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contract" });
  }
};

// DELETE
exports.deleteSellerContract = async (req, res) => {
  try {
    await SellerContract.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete contract" });
  }
};
