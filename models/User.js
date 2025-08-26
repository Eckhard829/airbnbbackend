const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'host', 'user'], default: 'user' }
});

module.exports = mongoose.model('User', userSchema);