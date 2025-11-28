var router = require('express').Router();

router.use('/admin/roles', require('./roles.admin.route'));

module.exports = router;
