// backend/farmerController.js
import Farmer from "../models/farmer.js";
import UniqueId from "../models/uniqueId.js";

// ✅ Create Farmer with Unique ID
export async function createFarmer(req, res) {
  try {
    // Step 1: Find active unique ID rule for Farmer
    const uniqueRule = await UniqueId.findOne({ name: "Farmer", status: "ACTIVE" });

    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Farmer" });
    }

    // Step 2: Generate farmerId
    const newSeq = parseInt(uniqueRule.currentSequence || uniqueRule.startSequence || "0") + 1;
    const farmerId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    // Step 3: Update currentSequence in UniqueId table
    uniqueRule.currentSequence = String(newSeq);
    await uniqueRule.save();

    // Step 4: Create new farmer with generated ID
    const newFarmer = new Farmer({
      ...req.body,
      farmerId,
    });

    await newFarmer.save();

    res.status(201).json({
      message: "Farmer created successfully",
      farmer: newFarmer,
    });
  } catch (err) {
    console.error("Create Farmer Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// ✅ Get all farmers with pagination, search, and filters
export async function getFarmers(req, res) {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      ...filters
    } = req.query;

    const query = {};

    // Global search
    if (search) {
      query.$or = [
        { farmerName: { $regex: search, $options: "i" } },
        { farmerId: { $regex: search, $options: "i" } },
      ];
    }

    // Field-level filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== "search") {
        query[key] = { $regex: value, $options: "i" };
      }
    });

    const total = await Farmer.countDocuments(query);
    const farmers = await Farmer.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ total, farmers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Get farmer by ID
export async function getFarmerById(req, res) {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Update farmer
export async function updateFarmer(req, res) {
  try {
    const updated = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Farmer not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// ✅ Delete farmer
export async function deleteFarmer(req, res) {
  try {
    await Farmer.findByIdAndDelete(req.params.id);
    res.json({ message: "Farmer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
