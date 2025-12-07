const express = require('express');
const router = express.Router();

const crudRoutes = require('./crud');
const managementRoutes = require('./management');

router.use('/users', crudRoutes, managementRoutes);

module.exports = router;
