const Product = require("../models/Product");
const UniqueId = require("../models/uniqueId");

// Create product with Unique ID generation
exports.createProduct = async (req, res) => {
  try {
    const uniqueRule = await UniqueId.findOne({ name: "Product", status: "ACTIVE" });
    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Product" });
    }

    const newSeq = parseInt(uniqueRule.currentSequence || uniqueRule.startSequence || "0") + 1;
    const productId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    uniqueRule.currentSequence = String(newSeq);
    await uniqueRule.save();

    const {
      product,
      type,
      hsCode,
      description,
      countriesBuy,
      countriesSell,
      grading,
      specification,
      defectivePercentage,
      harvestSeason,
      notes,
      status,
      origin,
    } = req.body;

    const newProduct = new Product({
      productId,
      product,
      type,
      hsCode,
      description,
      countriesBuy,
      countriesSell,
      grading,
      specification,
      defectivePercentage,
      harvestSeason,
      notes,
      status,
      origin,
      document: req.file ? req.file.originalname : null,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// Get paginated + filtered product list
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      
      product,
      type,
      hsCode,
      description,
      countriesBuy,
      countriesSell,
      grading,
      specification,
      defectivePercentage,
      harvestSeason,
      dateCreated,
      dateUpdated,
      origin,
      status,
      notes,
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { product: new RegExp(search, "i") },
        { productId: new RegExp(search, "i") },
        { hsCode: new RegExp(search, "i") },
      ];
    }

    if (productId) query.productId = new RegExp(productId, "i");
    if (product) query.product = new RegExp(product, "i");
    if (type) query.type = type;
    if (hsCode) query.hsCode = new RegExp(hsCode, "i");
    if (countriesBuy) query.countriesBuy = new RegExp(countriesBuy, "i");
    if (countriesSell) query.countriesSell = new RegExp(countriesSell, "i");
    if (grading) query.grading = new RegExp(grading, "i");
    if (specification) query.specification = new RegExp(specification, "i");
    if (defectivePercentage) query.defectivePercentage = new RegExp(defectivePercentage, "i");
    if (harvestSeason) query.harvestSeason = new RegExp(harvestSeason, "i");
    if (origin) query.origin = new RegExp(origin, "i");
    if (status) query.status = status;
    if (notes) query.notes = new RegExp(notes, "i");

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ products, total });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const {
      product,
      type,
      hsCode,
      description,
      countriesBuy,
      countriesSell,
      grading,
      specification,
      defectivePercentage,
      harvestSeason,
      notes,
      status,
      origin,
    } = req.body;

    const updatedFields = {
      product,
      type,
      hsCode,
      description,
      countriesBuy,
      countriesSell,
      grading,
      specification,
      defectivePercentage,
      harvestSeason,
      notes,
      status,
      origin,
    };

    if (req.file) {
      updatedFields.document = req.file.originalname;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Update error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};
