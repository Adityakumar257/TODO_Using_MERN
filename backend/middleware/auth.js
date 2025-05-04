// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Access denied. Not authorized.' });
  }
  next();
};

module.exports = { authenticate, authorize };
