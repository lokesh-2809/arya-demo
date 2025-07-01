const Broker = require('../models/broker');
const UniqueId = require('../models/uniqueId');

exports.getBrokers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "", // Global search only for brokerName
      brokerId,
      brokerName,
      phoneContact,
      emailContact,
      streetAddress,
      state,
      postcode,
      country,
      typeOfReferral,
      status,
    } = req.query;

    const query = {};

    // Global search (only brokerName)
    if (search) {
      query.brokerName = { $regex: search, $options: 'i' };
    }

    // Apply specific filters only if not using global search
    if (!search) {
      if (brokerId) query.brokerId = { $regex: brokerId, $options: 'i' };
      if (brokerName) query.brokerName = { $regex: brokerName, $options: 'i' };
      if (phoneContact) query.phoneContact = { $regex: phoneContact, $options: 'i' };
      if (emailContact) query.emailContact = { $regex: emailContact, $options: 'i' };
      if (streetAddress) query.streetAddress = { $regex: streetAddress, $options: 'i' };
      if (state) query.state = { $regex: state, $options: 'i' };
      if (postcode) query.postcode = { $regex: postcode, $options: 'i' };
      if (country) query.country = { $regex: country, $options: 'i' };
      if (typeOfReferral) query.typeOfReferral = { $regex: typeOfReferral, $options: 'i' };
      if (status) query.status = { $regex: status, $options: 'i' };
    }

    const brokers = await Broker.find(query)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Broker.countDocuments(query);

    res.status(200).json({ brokers, total });
  } catch (err) {
    console.error('Error fetching brokers:', err);
    res.status(500).json({ error: 'Failed to fetch brokers', details: err.message });
  }
};

// POST create a new broker (with Unique ID generation)
exports.createBroker = async (req, res) => {
  try {
    // 1. Get active UniqueId rule for "Broker"
    const uniqueRule = await UniqueId.findOne({ name: "Broker", status: "ACTIVE" });

    if (!uniqueRule) {
      return res.status(400).json({ message: "No active Unique ID rule for Broker" });
    }

    // 2. Generate brokerId
    const newSeq = parseInt(uniqueRule.currentSequence || uniqueRule.startSequence || "0") + 1;
    const brokerId = `${uniqueRule.prefix || ""}${newSeq}${uniqueRule.suffix || ""}`;

    // 3. Update currentSequence
    uniqueRule.currentSequence = String(newSeq);
    await uniqueRule.save();

    // 4. Create broker with generated brokerId
    const newBroker = new Broker({
      ...req.body,
      brokerId,
    });

    await newBroker.save();
    res.status(201).json({ message: 'Broker created', broker: newBroker });
  } catch (err) {
    console.error('Error creating broker:', err);
    res.status(500).json({ error: 'Failed to create broker', details: err.message });
  }
};

// GET broker by ID
exports.getBrokerById = async (req, res) => {
  try {
    const broker = await Broker.findById(req.params.id);
    if (!broker) return res.status(404).json({ error: 'Broker not found' });
    res.json(broker);
  } catch (err) {
    console.error('Error fetching broker by ID:', err);
    res.status(500).json({ error: 'Failed to fetch broker', details: err.message });
  }
};

// PUT update broker
exports.updateBroker = async (req, res) => {
  try {
    const updated = await Broker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Broker not found' });
    res.json({ message: 'Broker updated', broker: updated });
  } catch (err) {
    console.error('Error updating broker:', err);
    res.status(500).json({ error: 'Failed to update broker', details: err.message });
  }
};

// DELETE broker
exports.deleteBroker = async (req, res) => {
  try {
    const deleted = await Broker.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Broker not found' });
    res.json({ message: 'Broker deleted' });
  } catch (err) {
    console.error('Error deleting broker:', err);
    res.status(500).json({ error: 'Failed to delete broker', details: err.message });
  }
};
// DELETE multiple brokers
exports.deleteMultipleBrokers = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No broker IDs provided" });
    }
    await Broker.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Selected brokers deleted successfully" });
  } catch (err) {
    console.error("Error deleting multiple brokers:", err);
    res.status(500).json({ error: "Failed to delete brokers", details: err.message });
  }
};