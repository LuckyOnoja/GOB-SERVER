const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 }, // Track user balance
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }], // Reference to transactions
});

module.exports = mongoose.model('User', UserSchema);