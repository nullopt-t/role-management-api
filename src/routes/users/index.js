var router = require('express').Router();

router.use('/users', require('./users.route'));
router.use('/admin/users', require('./users.admin.route'));

module.exports = router;
