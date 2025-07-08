const crypto = require('crypto');

// Generate a cryptographically secure random  64 bytes string
const generateJwtSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

const JWT_SECRET = generateJwtSecret();
console.log('Your JWT Secret:', JWT_SECRET);

