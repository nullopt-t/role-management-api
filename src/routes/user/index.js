var router = require('express').Router();

router.use('/', require('./user.route'));
router.use('/admin', require('./admin.route'));

module.exports = router;
