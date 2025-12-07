var router = require('express').Router();
var {
	assignRoles,
	addRoles,
	removeRoles,
	verifyEmail,
	updateLastLogin,
} = require('../../../controllers/users');

/**
 * @swagger
 * /admin/users/{id}/roles/assign:
 *   post:
 *     summary: Assign roles to user (replaces existing)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles assigned
 */
router.post('/:id/roles/assign', assignRoles);

/**
 * @swagger
 * /admin/users/{id}/roles/add:
 *   post:
 *     summary: Add roles to user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles added
 */
router.post('/:id/roles/add', addRoles);

/**
 * @swagger
 * /admin/users/{id}/roles/remove:
 *   post:
 *     summary: Remove roles from user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Roles removed
 */
router.post('/:id/roles/remove', removeRoles);

/**
 * @swagger
 * /admin/users/{id}/verify-email:
 *   post:
 *     summary: Mark user email as verified
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified
 */
router.post('/:id/verify-email', verifyEmail);

/**
 * @swagger
 * /admin/users/{id}/last-login:
 *   post:
 *     summary: Update user last login timestamp
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Last login updated
 */
router.post('/:id/last-login', updateLastLogin);

module.exports = router;
