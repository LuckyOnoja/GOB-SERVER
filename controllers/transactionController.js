const Transaction = require("../models/Transaction");
const Propeneer = require("../models/Propeneer"); 
const User = require("../models/User");

// Transfer Funds
exports.transferFunds = async (req, res) => {
  try {
    const { senderId, receiverAccountNumber, amount } = req.body;

    // Find sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Check if sender has sufficient balance
    if (sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Update sender and receiver balances
    sender.balance -= amount;
    receiver.balance += amount;

    // Create a new transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      status: "Completed",
    });

    // Save changes
    await sender.save();
    await receiver.save();
    await transaction.save();

    res.status(200).json({ message: "Transfer successful", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all transactions for the logged-in user
exports.getUserTransactions = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      // Find transactions where the user is either the sender or receiver
      const transactions = await Transaction.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate({
          path: "sender",
          model: Propeneer, // Using the Propeneer model for sender
          select: "username email", // choose fields to populate
        })
        .populate({
          path: "receiver",
          model: User, // Using the User model for receiver
          select: "firstName lastName email", // choose fields to populate
        })
        .sort({ date: -1 }); // Sort by date (newest first)
  
      res.status(200).json({ transactions });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };