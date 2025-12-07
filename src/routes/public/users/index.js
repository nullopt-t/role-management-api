var router = require('express').Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user profile
 */
router.get('/me', function (req, res) {
	res.send(`${req.method};${req.path}`);
});

module.exports = router;
