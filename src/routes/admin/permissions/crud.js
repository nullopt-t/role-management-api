var router = require('express').Router();
var {
	getPermissions,
	getPermissionByID,
	getPermissionByActionAndResource,
	getPermissionsByAction,
	getPermissionsByResource,
	getPermissionStats,
	getUniqueActions,
	getUniqueResources,
	getActionResourceMap,
	createPermission,
	bulkCreatePermissions,
	updatePermission,
	softDeletePermission,
	restorePermission,
	deletePermission,
} = require('../../../controllers/permissions');

/**
 * @swagger
 * /admin/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     parameters:
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *           default: false
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/', getPermissions);

/**
 * @swagger
 * /admin/permissions/stats:
 *   get:
 *     summary: Get permission statistics
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Permission statistics
 */
router.get('/stats', getPermissionStats);

/**
 * @swagger
 * /admin/permissions/actions:
 *   get:
 *     summary: Get unique actions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of unique actions
 */
router.get('/actions', getUniqueActions);

/**
 * @swagger
 * /admin/permissions/resources:
 *   get:
 *     summary: Get unique resources
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of unique resources
 */
router.get('/resources', getUniqueResources);

/**
 * @swagger
 * /admin/permissions/map:
 *   get:
 *     summary: Get action-resource mapping
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: Action to resources mapping
 */
router.get('/map', getActionResourceMap);

/**
 * @swagger
 * /admin/permissions/action/{action}:
 *   get:
 *     summary: Get all permissions for an action
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/action/:action', getPermissionsByAction);

/**
 * @swagger
 * /admin/permissions/resource/{resource}:
 *   get:
 *     summary: Get all permissions for a resource
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/resource/:resource', getPermissionsByResource);

/**
 * @swagger
 * /admin/permissions/{action}/{resource}:
 *   get:
 *     summary: Get permission by action and resource
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: resource
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission found
 */
router.get('/:action/:resource', getPermissionByActionAndResource);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission found
 */
router.get('/:id', getPermissionByID);

/**
 * @swagger
 * /admin/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *               resource:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - action
 *               - resource
 *               - description
 *     responses:
 *       201:
 *         description: Permission created
 */
router.post('/', createPermission);

/**
 * @swagger
 * /admin/permissions/bulk:
 *   post:
 *     summary: Bulk create permissions
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     action:
 *                       type: string
 *                     resource:
 *                       type: string
 *                     description:
 *                       type: string
 *             required:
 *               - permissions
 *     responses:
 *       201:
 *         description: Permissions created
 */
router.post('/bulk', bulkCreatePermissions);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   patch:
 *     summary: Update permission
 *     tags: [Permissions]
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
 *               action:
 *                 type: string
 *               resource:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Permission updated
 */
router.patch('/:id', updatePermission);

/**
 * @swagger
 * /admin/permissions/{id}:
 *   delete:
 *     summary: Soft delete permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission deleted
 */
router.delete('/:id', softDeletePermission);

/**
 * @swagger
 * /admin/permissions/{id}/restore:
 *   post:
 *     summary: Restore soft-deleted permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission restored
 */
router.post('/:id/restore', restorePermission);

/**
 * @swagger
 * /admin/permissions/{id}/permanent:
 *   delete:
 *     summary: Permanently delete permission
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission permanently deleted
 */
router.delete('/:id/permanent', deletePermission);

module.exports = router;
