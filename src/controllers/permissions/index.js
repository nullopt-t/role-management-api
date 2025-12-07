var PermissionService = require('../../services/permission');
var {
	sendSuccess,
	sendError,
	checkResourceExists,
} = require('../../utilities/controller.utility');

var {
	idParamSchema,
	permissionCreateBodySchema,
	permissionBulkCreateBodySchema,
	permissionByActionResourceSchema,
} = require('../../utilities/validation.utility');

module.exports = {
	// Get all permissions
	async getPermissions(req, res, next) {
		try {
			const { includeInactive = false } = req.query;

			let permissions;
			if (includeInactive === 'true') {
				permissions = await PermissionService.getPermissionsIncludingInactive();
			} else {
				permissions = await PermissionService.getPermissions();
			}

			return sendSuccess(res, permissions);
		} catch (error) {
			next(error);
		}
	},

	// Get permission by ID
	async getPermissionByID(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const permission = await PermissionService.getPermissionByID(id);
			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, permission);
		} catch (error) {
			next(error);
		}
	},

	// Get permission by action and resource
	async getPermissionByActionAndResource(req, res, next) {
		try {
			const { action, resource } = permissionByActionResourceSchema.parse(
				req.params
			);
			const permission =
				await PermissionService.getPermissionByActionAndResource(
					action,
					resource
				);

			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, permission);
		} catch (error) {
			next(error);
		}
	},

	// Get permissions by action
	async getPermissionsByAction(req, res, next) {
		try {
			const { action } = req.params;

			if (!action) {
				return sendError(res, 'Action is required', 400);
			}

			const permissions = await PermissionService.findByAction(action);
			return sendSuccess(res, permissions);
		} catch (error) {
			next(error);
		}
	},

	// Get permissions by resource
	async getPermissionsByResource(req, res, next) {
		try {
			const { resource } = req.params;

			if (!resource) {
				return sendError(res, 'Resource is required', 400);
			}

			const permissions = await PermissionService.findByResource(resource);
			return sendSuccess(res, permissions);
		} catch (error) {
			next(error);
		}
	},

	// Get permission statistics
	async getPermissionStats(req, res, next) {
		try {
			const stats = await PermissionService.getStats();
			return sendSuccess(res, stats);
		} catch (error) {
			next(error);
		}
	},

	// Get unique actions
	async getUniqueActions(req, res, next) {
		try {
			const actions = await PermissionService.getUniqueActions();
			return sendSuccess(res, actions);
		} catch (error) {
			next(error);
		}
	},

	// Get unique resources
	async getUniqueResources(req, res, next) {
		try {
			const resources = await PermissionService.getUniqueResources();
			return sendSuccess(res, resources);
		} catch (error) {
			next(error);
		}
	},

	// Get action-resource map
	async getActionResourceMap(req, res, next) {
		try {
			const map = await PermissionService.getActionResourceMap();
			return sendSuccess(res, map);
		} catch (error) {
			next(error);
		}
	},

	// Create permission
	async createPermission(req, res, next) {
		try {
			const { action, resource, description } =
				permissionCreateBodySchema.parse(req.body);

			// Check if permission already exists
			const exists = await PermissionService.checkPermissionExists(
				action,
				resource
			);
			if (exists) {
				return sendError(res, 'Permission already exists', 409);
			}

			const permission = await PermissionService.createPermission({
				action,
				resource,
				description,
			});

			return sendSuccess(res, permission, 201);
		} catch (error) {
			next(error);
		}
	},

	// Bulk create permissions
	async bulkCreatePermissions(req, res, next) {
		try {
			const { permissions } = permissionBulkCreateBodySchema.parse(req.body);
			const created = await PermissionService.bulkCreatePermissions(
				permissions
			);

			return sendSuccess(
				res,
				{
					message: 'Permissions created',
					count: created.length,
					permissions: created,
				},
				201
			);
		} catch (error) {
			next(error);
		}
	},

	// Update permission
	async updatePermission(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const permission = await PermissionService.updatePermission(id, req.body);
			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, permission);
		} catch (error) {
			next(error);
		}
	},

	// Soft delete permission
	async softDeletePermission(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const permission = await PermissionService.softDeletePermission(id);
			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, {
				message: 'Permission deleted',
				permission,
			});
		} catch (error) {
			next(error);
		}
	},

	// Restore permission
	async restorePermission(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const permission = await PermissionService.restorePermission(id);
			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, {
				message: 'Permission restored',
				permission,
			});
		} catch (error) {
			next(error);
		}
	},

	// Delete permission (hard delete)
	async deletePermission(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const permission = await PermissionService.deletePermission(id);
			if (!checkResourceExists(permission, res, 'Permission')) return;

			return sendSuccess(res, {
				message: 'Permission permanently deleted',
				permission,
			});
		} catch (error) {
			next(error);
		}
	},
};
