const Propeneer = require("../models/Propeneer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

// Register Propeneer
exports.registerPropeneer = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const propeneer = new Propeneer({
      email,
      username,
      password: hashedPassword,
    });
    await propeneer.save();

    // Send email with username and password
    const subject = "Welcome to Global Online Banking";
    const htmlTemplate = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <h2>Welcome to Global Online Banking</h2>
    <p>Thank you for registering as a Propeneer! Here are your login details:</p>
    <p><strong>Username:</strong> ${username}</p>
    <p><strong>Password:</strong> ${password}</p>
    <p>Please keep your login details secure and do not share them with anyone.</p>
    <p>Best regards,<br/>The Global Online Banking Team</p>
  </div>
   `;

    await sendEmail(email, subject, htmlTemplate);

    res.status(201).json({
      message:
        "Propeneer registered successfully. Check your email for login details.",
    });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email. Please contact support.' });
  }
};

// Login Propeneer
exports.loginPropeneer = async (req, res) => {
  const { username, password } = req.body;
  try {
    const propeneer = await Propeneer.findOne({ username });
    if (!propeneer)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, propeneer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: propeneer._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
