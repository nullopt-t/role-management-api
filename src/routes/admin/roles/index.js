const express = require('express');
const router = express.Router();

// Import routes
const crudRoutes = require('./crud');
const permissionsRoutes = require('./permissions');

// Use routes
router.use('/roles', [crudRoutes, permissionsRoutes]);

module.exports = router;
