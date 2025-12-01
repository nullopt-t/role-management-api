var router = require('express').Router();
var {
	getRoles,
	getRoleByID,
	createRole,
	updateRole,
	addRolePermissions,
	removeRolePermissions,
} = require('../../controllers/roles');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management endpoints
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *       500:
 *         description: Server error
 */
router.get('/', getRoles);

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID (Mongo ObjectId)
 *     responses:
 *       200:
 *         description: Role found
 *       404:
 *         description: Role not found
 */
router.get('/:id', getRoleByID);

/**
 * @swagger
 * /roles:
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
 *                 items:
 *                   type: string
 *             required:
 *               - name
 *           example:
 *             name: admin
 *             description: Admin role
 *             permissions: ["692cc6af17e04ac3fd32834a"]
 *     responses:
 *       201:
 *         description: Role created
 *       422:
 *         description: Validation error
 */
router.post('/', createRole);

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID (Mongo ObjectId)
 *     responses:
 *       200:
 *         description: Role deleted
 *       404:
 *         description: Role not found
 */
router.delete('/:id', (req, res) => {
	res.send('deleteRole');
});

/**
 * @swagger
 * /roles/{id}:
 *   patch:
 *     summary: Update role (name/description)
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
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
 *           example:
 *             name: superadmin
 *             description: Super admin role
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: Role not found
 */
router.patch('/:id', updateRole);

/**
 * @swagger
 * /roles/{id}/permissions/add:
 *   patch:
 *     summary: Add permissions to a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *             minItems: 1
 *           example:
 *             - 692cc6af17e04ac3fd32834a
 *     responses:
 *       200:
 *         description: Permissions added
 *       422:
 *         description: Validation error
 *       404:
 *         description: Role not found
 */
router.patch('/:id/permissions/add', addRolePermissions);

/**
 * @swagger
 * /roles/{id}/permissions/remove:
 *   patch:
 *     summary: Remove permissions from a role
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *             minItems: 1
 *           example:
 *             - 692cc6af17e04ac3fd32834a
 *     responses:
 *       200:
 *         description: Permissions removed
 *       422:
 *         description: Validation error
 *       404:
 *         description: Role not found
 */
router.patch('/:id/permissions/remove', removeRolePermissions);

module.exports = router;
