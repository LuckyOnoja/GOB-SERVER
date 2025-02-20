const mongoose = require("mongoose");

const PropeneerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }], // Reference to transactions
});

module.exports = mongoose.model("Propeneer", PropeneerSchema);
