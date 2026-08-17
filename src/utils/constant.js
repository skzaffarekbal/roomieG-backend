const crypto = require('node:crypto');

const membershipAmount = {
  silver: 99,
  gold: 199,
};

function generateReceiptId(prefix = 'roomieg') {
  const timestamp = Date.now(); // 13-digit millisecond timestamp
  const randomHex = crypto.randomBytes(4).toString('hex'); // 8 random hex characters

  const receipt = `${prefix}_${timestamp}_${randomHex}`;

  // Enforce the 40-character maximum limit safety constraint
  return receipt.substring(0, 40);
}

module.exports = { membershipAmount, generateReceiptId };
