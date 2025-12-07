var RoleService = require('../../services/role');
var {
	sendSuccess,
	sendError,
	checkResourceExists,
} = require('../../utilities/controller.utility');
var {
	idParamSchema,
	includeInactiveQuerySchema,
	roleCreateBodySchema,
	roleUpdateBodySchema,
	rolePermissionsBodySchema,
	permissionIdArrayBodySchema,
} = require('../../utilities/validation.utility');

module.exports = {
	// Get all roles
	async getRoles(req, res, next) {
		try {
			const { includeInactive } = includeInactiveQuerySchema.parse(req.query);

			let roles;
			if (includeInactive) {
				roles = await RoleService.getRolesIncludingInactive();
			} else {
				roles = await RoleService.getRoles();
			}

			return sendSuccess(res, roles);
		} catch (error) {
			next(error);
		}
	},

	// Get single role
	async getRoleByID(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const role = await RoleService.getRoleByID(id);

			if (!checkResourceExists(role, res, 'Role')) return;

			return sendSuccess(res, role);
		} catch (error) {
			next(error);
		}
	},

	// Get role by name
	async getRoleByName(req, res, next) {
		try {
			const { name } = req.params;

			if (!name || typeof name !== 'string') {
				return sendError(res, 'Role name is required', 400);
			}

			const role = await RoleService.getRoleByName(name);

			if (!checkResourceExists(role, res, 'Role')) return;

			return sendSuccess(res, role);
		} catch (error) {
			next(error);
		}
	},

	// Get role statistics
	async getRoleStats(req, res, next) {
		try {
			const stats = await RoleService.getStats();
			return sendSuccess(res, stats);
		} catch (error) {
			next(error);
		}
	},

	// Create role
	async createRole(req, res, next) {
		try {
			const { name, description, permissions } = roleCreateBodySchema.parse(
				req.body
			);

			// Check if role name already exists
			const exists = await RoleService.existsByName(name);
			if (exists) {
				return sendError(res, 'Role name already in use', 409);
			}

			const role = await RoleService.createRole({
				name,
				description,
				permissions,
			});

			return sendSuccess(res, role, 201);
		} catch (error) {
			next(error);
		}
	},

	// Update role
	async updateRole(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const newFields = roleUpdateBodySchema.parse(req.body);

			// Check role exists
			const exists = await RoleService.existsById(id);
			if (!checkResourceExists(exists, res, 'Role')) return;

			// Check name uniqueness if updating name
			if (newFields.name) {
				const nameExists = await RoleService.existsByName(newFields.name);
				if (nameExists) {
					return sendError(res, 'Role name already in use', 409);
				}
			}

			const updatedRole = await RoleService.updateRole(id, newFields);
			return sendSuccess(res, updatedRole);
		} catch (error) {
			next(error);
		}
	},

	// Soft delete role
	async softDeleteRole(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const exists = await RoleService.existsById(id);
			if (!checkResourceExists(exists, res, 'Role')) return;

			const role = await RoleService.softDeleteRole(id);
			return sendSuccess(res, { message: 'Role deleted', role });
		} catch (error) {
			next(error);
		}
	},

	// Restore role
	async restoreRole(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const role = await RoleService.restoreRole(id);

			if (!checkResourceExists(role, res, 'Role')) return;

			return sendSuccess(res, { message: 'Role restored', role });
		} catch (error) {
			next(error);
		}
	},

	// Add permissions to role
	async addRolePermissions(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const permissions = rolePermissionsBodySchema.parse(req.body);

			const exists = await RoleService.existsById(id);
			if (!checkResourceExists(exists, res, 'Role')) return;

			const updated = await RoleService.addPermissions(id, permissions);
			return sendSuccess(res, { message: 'Permissions added', role: updated });
		} catch (err) {
			next(err);
		}
	},

	// Remove permissions from role
	async removeRolePermissions(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const permissions = rolePermissionsBodySchema.parse(req.body);

			const exists = await RoleService.existsById(id);
			if (!checkResourceExists(exists, res, 'Role')) return;

			const updated = await RoleService.removePermissions(id, permissions);
			return sendSuccess(res, {
				message: 'Permissions removed',
				role: updated,
			});
		} catch (err) {
			next(err);
		}
	},

	// Set permissions on role (replace all)
	async setRolePermissions(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const { permissionIds } = permissionIdArrayBodySchema.parse(req.body);

			const exists = await RoleService.existsById(id);
			if (!checkResourceExists(exists, res, 'Role')) return;

			const updated = await RoleService.setPermissions(id, permissionIds);
			return sendSuccess(res, { message: 'Permissions set', role: updated });
		} catch (err) {
			next(err);
		}
	},

	// Get permissions for role
	async getRolePermissions(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const permissions = await RoleService.getPermissionsByRole(id);
			return sendSuccess(res, permissions);
		} catch (err) {
			next(err);
		}
	},

	// Check if role has permission
	async hasRolePermission(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const { permissionId } = req.body;

			if (!permissionId) {
				return sendError(res, 'permissionId is required', 400);
			}

			const hasPermission = await RoleService.hasPermission(id, permissionId);
			return sendSuccess(res, { hasPermission });
		} catch (err) {
			next(err);
		}
	},
};
