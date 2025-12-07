const express = require('express');
const router = express.Router();

// Import routes
const crudRoutes = require('./crud');

// Use routes
router.use('/permissions', crudRoutes);

module.exports = router;
