const Container = require("../models/container");
const UniqueId = require("../models/uniqueId");
// GET all containers with filters + pagination + global search
exports.getContainers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      hireCompany,
      phoneContact,
      emailContact,
      streetAddress,
      state,
      postcode,
      country,
      containerSize,
      maxHoldingQuantity,
      containerGrade,
      status,
      globalSearch
    } = req.query;

    const query = {};

    if (globalSearch) {
      const searchRegex = { $regex: globalSearch, $options: "i" };
      query.$or = [
        { hireCompany: searchRegex },
        { phoneContact: searchRegex },
        { emailContact: searchRegex },
        { streetAddress: searchRegex },
        { state: searchRegex },
        { postcode: searchRegex },
        { country: searchRegex },
        { containerSize: searchRegex },
        { containerGrade: searchRegex },
        { status: searchRegex }
      ];
    } else {
      if (hireCompany) query.hireCompany = { $regex: hireCompany, $options: 'i' };
      if (phoneContact) query.phoneContact = { $regex: phoneContact, $options: 'i' };
      if (emailContact) query.emailContact = { $regex: emailContact, $options: 'i' };
      if (streetAddress) query.streetAddress = { $regex: streetAddress, $options: 'i' };
      if (state) query.state = { $regex: state, $options: 'i' };
      if (postcode) query.postcode = { $regex: postcode, $options: 'i' };
      if (country) query.country = { $regex: country, $options: 'i' };
      if (containerSize) query.containerSize = { $regex: containerSize, $options: 'i' };
      if (containerGrade) query.containerGrade = { $regex: containerGrade, $options: 'i' };
      if (status) query.status = { $regex: status, $options: 'i' };
      if (maxHoldingQuantity) query.maxHoldingQuantity = parseInt(maxHoldingQuantity);
    }

    const containers = await Container.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Container.countDocuments(query);

    res.status(200).json({ containers, total });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch containers', details: err.message });
  }
};

// POST create container with unique containerId
exports.createContainer = async (req, res) => {
  try {
    // Step 1: Find active UniqueId rule for Container
    const uniqueRule = await UniqueId.findOne({ name: { $regex: /^container$/i }, status: "ACTIVE" });

    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Container" });
    }

    // Step 2: Generate new ID based on rule
    const newSeq = parseInt(uniqueRule.currentSequence || uniqueRule.startSequence || "0") + 1;
    const containerId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    // Step 3: Update UniqueId sequence
    uniqueRule.currentSequence = String(newSeq);
    await uniqueRule.save();

    // Step 4: Create new container with generated ID
    const container = await Container.create({ ...req.body, containerId });

    res.status(201).json({ message: 'Container created', container });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create container', details: err.message });
  }
};


// GET by ID
exports.getContainerById = async (req, res) => {
  try {
    const container = await Container.findById(req.params.id);
    if (!container) return res.status(404).json({ error: 'Not found' });
    res.json(container);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch', details: err.message });
  }
};

// PUT update container
exports.updateContainer = async (req, res) => {
  try {
    const updated = await Container.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Updated', container: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// DELETE container
exports.deleteContainer = async (req, res) => {
  try {
    const deleted = await Container.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};
