var router = require('express').Router();

router.use('/admin', require('./roles.admin.route'));

module.exports = router;
