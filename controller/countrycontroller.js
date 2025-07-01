const Country = require("../models/country");

// Create country
exports.createCountry = async (req, res) => {
  try {
    const {
      countryName,
      countryCode
    } = req.body;

    const newCountry = new Country({
      countryName,
      countryCode
    });

    await newCountry.save();

    res.status(201).json({
      message: "Country created successfully",
      country: newCountry,
    });
  } catch (error) {
    console.error("Create Country Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get all countries (paginated & filtered)
exports.getCountries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      countryName,
      countryCode
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { countryName: new RegExp(search, "i") },
        { countryCode: new RegExp(search, "i") },
      ];
    }

    if (countryName) query.countryName = new RegExp(countryName, "i");
    if (countryCode) query.countryCode = new RegExp(countryCode, "i");
    if (fssai) query.fssai = new RegExp(fssai, "i");
    if (panNo) query.panNo = new RegExp(panNo, "i");
    if (ifsc) query.ifsc = new RegExp(ifsc, "i");
    if (gst) query.gst = new RegExp(gst, "i");
    if (status) query.status = status;
    if (notes) query.notes = new RegExp(notes, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Country.countDocuments(query);

    const countries = await Country.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ countries, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single country by ID
exports.getCountryById = async (req, res) => {
  try {
    const country = await Country.findById(req.params.id);
    if (!country) return res.status(404).json({ message: "Country not found" });
    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update country
exports.updateCountry = async (req, res) => {
  try {
    const {
      countryName,
      countryCode
    } = req.body;

    const updatedFields = {
      countryName,
      countryCode
    };

    if (req.file) {
      updatedFields.document = req.file.originalname;
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updatedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    res
      .status(200)
      .json({ message: "Country updated", country: updatedCountry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete country
exports.deleteCountry = async (req, res) => {
  try {
    const deleted = await Country.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Country not found" });
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
