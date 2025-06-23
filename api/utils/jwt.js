const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  generateToken: (userId) => {
    // console.log('Generating token for user ID:', userId); // Debug log
    const token = jwt.sign(
      { id: userId }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    // console.log('Generated token:', token); // Debug log
    return token;
  },

  verifyToken: (token) => {
    try {
      // console.log('Verifying token:', token); // Debug log
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Token decoded successfully:', decoded); // Debug log
      return decoded;
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return null;
    }
  }
};