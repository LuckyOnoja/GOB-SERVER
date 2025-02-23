const User = require('../models/User');

const generateFatId = async () => {
  let fatId;
  let isUnique = false;
  const prefixes = ['9896', '8896', '7896']; // prefixes used
  let prefixIndex = 0;

  // Keep generating a unique fatId until one is found
  while (!isUnique) {
    // Generate the remaining 12 digits
    const remainingDigits = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    
    // combine the prefixes used with the remainingDigits
    fatId = prefixes[prefixIndex] + remainingDigits;

    // Checking if fatId is unique
    const existingUser = await User.findOne({ fatId });
    if (!existingUser) {
      isUnique = true; // Exit loop if the fatId is unique
    } else {
      // If the fatId is not unique, move to the next prefix
      prefixIndex = (prefixIndex + 1) % prefixes.length;
    }
  }

  return fatId;
};

module.exports = generateFatId;