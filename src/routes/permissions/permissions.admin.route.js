var router = require('express').Router();
var { getPermissions } = require('../../controllers/permissions');

router.get('/', getPermissions);

module.exports = router;
