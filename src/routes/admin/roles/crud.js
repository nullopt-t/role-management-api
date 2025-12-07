var router = require('express').Router();
var {
	getRoles,
	getRoleByID,
	getRoleByName,
	getRoleStats,
	createRole,
	updateRole,
	softDeleteRole,
	restoreRole,
} = require('../../../controllers/roles');

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', getRoles);

/**
 * @swagger
 * /admin/roles/stats:
 *   get:
 *     summary: Get role statistics
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Role statistics
 */
router.get('/stats', getRoleStats);

/**
 * @swagger
 * /admin/roles/name/{name}:
 *   get:
 *     summary: Get role by name
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found
 */
router.get('/name/:name', getRoleByName);

/**
 * @swagger
 * /admin/roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role found
 */
router.get('/:id', getRoleByID);

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               permissions:
 *                 type: array
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Role created
 */
router.post('/', createRole);

/**
 * @swagger
 * /admin/roles/{id}:
 *   patch:
 *     summary: Update role
 *     tags: [Roles]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch('/:id', updateRole);

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     summary: Soft delete role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.delete('/:id', softDeleteRole);

/**
 * @swagger
 * /admin/roles/{id}/restore:
 *   post:
 *     summary: Restore soft-deleted role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role restored
 */
router.post('/:id/restore', restoreRole);

module.exports = router;
