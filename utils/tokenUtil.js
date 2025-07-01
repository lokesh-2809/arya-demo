// utils/tokenUtil.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'aryapulses@secretkey';

exports.generateToken = (payload, expiresIn = '1h') =>
  jwt.sign(payload, JWT_SECRET, { expiresIn });


exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
