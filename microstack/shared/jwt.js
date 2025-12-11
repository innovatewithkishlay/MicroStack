const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'default_secret_do_not_use_in_production';

/**
 * Sign a JWT token
 * @param {Object} payload 
 * @param {string} expiresIn 
 * @returns {string}
 */
const sign = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token 
 * @returns {Object}
 */
const verify = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = { sign, verify };
