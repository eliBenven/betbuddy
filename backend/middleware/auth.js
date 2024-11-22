require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const SECRET_KEY = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided or malformed header');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Ensure SECRET_KEY matches
    console.log('Token decoded:', decoded);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      console.log('No user found for decoded token');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Token verification failed' });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

module.exports = { authenticate, authorizeAdmin };
