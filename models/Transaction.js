const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "Propeneer", required: true }, // Sender's user ID
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Receiver's user ID
  amount: { type: Number, required: true }, 
  date: { type: Date, default: Date.now }, 
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
});

module.exports = mongoose.model("Transaction", TransactionSchema);