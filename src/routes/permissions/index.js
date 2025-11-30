var router = require('express').Router();

router.use('/admin/permissions', require('./permissions.admin.route'));

module.exports = router;
