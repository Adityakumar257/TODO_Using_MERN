// routes/admin.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/admin-dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Panel' });
});

module.exports = router;
