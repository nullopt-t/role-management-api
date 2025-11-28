var router = require('express').Router();

router.get('/me', function (req, res) {
	res.send(`${req.method};${req.path}`);
});

module.exports = router;
