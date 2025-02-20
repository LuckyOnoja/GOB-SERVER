const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const generateAccountNumber = require('../utils/generateAccountNumber');

// Register User
// Register User
exports.registerUser = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generating a unique account number
      const accountNumber = await generateAccountNumber();
  
      // Create new user
      const user = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        accountNumber, 
      });
      await user.save();
  
      // Send email with login details and account number
      const subject = 'Welcome to Global Online Banking';
      const text = `Thank you for registering! Here are your login details:
                    Email: ${email}
                    Password: ${password}
                    Account Number: ${accountNumber}`;
  
      await sendEmail(email, subject, text);
  
      res.status(201).json({ message: 'User registered successfully. Check your email for login details.' });
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
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Get User Dashboard
exports.getDashboard = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };