const express = require('express');
const router = express.Router();

// Import routes
const publicUsersRoutes = require('./users');

// Use routes
router.use('/users', publicUsersRoutes);

module.exports = router;
