const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");
const generateAccountNumber = require("../utils/generateAccountNumber");
const generateFatId = require("../utils/generateFatId");

// Register User
// Register User
exports.registerUser = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generating a unique account number and fatId
    const accountNumber = await generateAccountNumber();
    const fatId = await generateFatId();

    // Create new user
    const user = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      accountNumber,
      fatId
    });
    await user.save();

    // Send email with login details and account number
    const subject = "Welcome to Global Online Banking";
    const text = `Thank you for registering! Here is your Account Number:
               
                    Account Number: ${accountNumber}`;

    await sendEmail(email, subject, text);

    res.status(201).json({
      message:
        "User registered successfully. Check your email for login details.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if email is already registered
exports.checkEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ isTaken: true });
    }
    return res.status(200).json({ isTaken: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get User Dashboard
exports.getUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search User by Account Number
exports.searchByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find user by account number
    const user = await User.findOne({ accountNumber }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateFatStatus = async (req, res) => {
  const { fatId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { fatId },
      { fatStatus: "verified" },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "FAT Verified", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};