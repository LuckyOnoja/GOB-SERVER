const User = require('../models/User');

const generateAccountNumber = async () => {
  let accountNumber;
  let isUnique = false;

  // Keep generating a unique account number until one is found
  while (!isUnique) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // Generate 10-digit number
    const existingUser = await User.findOne({ accountNumber });
    if (!existingUser) {
      isUnique = true; // Exit loop if the account number is unique
    }
  }

  return accountNumber;
};

module.exports = generateAccountNumber;