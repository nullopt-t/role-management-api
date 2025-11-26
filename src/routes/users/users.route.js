var router = require('express').Router();

router.get('/me', function (req, res, next) {
	res.send(`${req.method};${req.path}`);
});

module.exports = router;
