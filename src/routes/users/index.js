var router = require('express').Router();

router.use('/', require('./users.route'));
router.use('/admin', require('./users.admin.route'));

module.exports = router;
