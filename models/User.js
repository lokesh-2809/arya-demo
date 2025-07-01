const mongoose = require('mongoose');

// ✅ Force the correct database regardless of global connect()
const db = mongoose.connection.useDb('arya_pulses');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
});

// ✅ Export the model tied to arya_pulses
module.exports = db.model('User', UserSchema);
