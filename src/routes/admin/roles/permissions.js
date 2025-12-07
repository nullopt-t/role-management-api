var router = require('express').Router();
var {
	addRolePermissions,
	removeRolePermissions,
	setRolePermissions,
	getRolePermissions,
	hasRolePermission,
} = require('../../../controllers/roles');

/**
 * @swagger
 * /admin/roles/{id}/permissions:
 *   get:
 *     summary: Get permissions for a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role permissions
 */
router.get('/:id/permissions', getRolePermissions);

/**
 * @swagger
 * /admin/roles/{id}/permissions/add:
 *   post:
 *     summary: Add permissions to a role
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
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Permissions added
 */
router.post('/:id/permissions/add', addRolePermissions);

/**
 * @swagger
 * /admin/roles/{id}/permissions/remove:
 *   post:
 *     summary: Remove permissions from a role
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
 *             type: array
 *             items:
 *               type: string
 *     responses:
 *       200:
 *         description: Permissions removed
 */
router.post('/:id/permissions/remove', removeRolePermissions);

/**
 * @swagger
 * /admin/roles/{id}/permissions/set:
 *   post:
 *     summary: Set permissions on role (replace all)
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
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions set
 */
router.post('/:id/permissions/set', setRolePermissions);

/**
 * @swagger
 * /admin/roles/{id}/permissions/check:
 *   post:
 *     summary: Check if role has specific permission
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
 *               permissionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission check result
 */
router.post('/:id/permissions/check', hasRolePermission);

module.exports = router;
