var RoleService = require('../../services/role');
var {
	createRoleSchema,
	getRoleByIDSchema,
	roleIDSchema,
	updateRoleByIDBodySchema,
	addPermissionsSchema,
	removePermissionsSchema,
} = require('./validator');

module.exports = {
	async getRoles(req, res, next) {
		try {
			const roles = await RoleService.getRoles();
			res.json({
				success: true,
				data: roles,
			});
		} catch (error) {
			next(error);
		}
	},
	async getRoleByID(req, res, next) {
		try {
			const { id } = getRoleByIDSchema.parse(req.params);

			const role = await RoleService.getRoleByID(id);
			if (!role) {
				return res.status(404).json({
					success: false,
					message: 'Not Found',
				});
			}

			res.json({
				success: true,
				data: role,
			});
		} catch (error) {
			next(error);
		}
	},
	async createRole(req, res, next) {
		try {
			const { name, description, permissions } = createRoleSchema.parse(
				req.body
			);
			const role = await RoleService.createRole({
				name,
				description,
				permissions,
			});
			res.json({
				success: true,
				data: role,
			});
		} catch (error) {
			next(error);
		}
	},
	async updateRole(req, res, next) {
		try {
			const { id } = roleIDSchema.parse(req.params);
			const newFields = updateRoleByIDBodySchema.parse(req.body);

			if (!(await RoleService.existsByID(id))) {
				return res.status(404).json({
					success: false,
					message: 'Role not found',
				});
			}
			const updatedRole = await RoleService.updateRole(id, newFields);
			res.json({
				success: true,
				data: updatedRole,
			});
		} catch (error) {
			next(error);
		}
	},
	async addRolePermissions(req, res, next) {
		try {
			const { id } = roleIDSchema.parse(req.params);
			const permissions = addPermissionsSchema.parse(req.body);

			if (!(await RoleService.existsByID(id))) {
				return res.status(404).json({
					success: false,
					message: 'Role not found',
				});
			}

			const updated = await RoleService.addPermissions(id, permissions);

			res.json({
				success: true,
				data: updated,
			});
		} catch (err) {
			next(err);
		}
	},
	async removeRolePermissions(req, res, next) {
		try {
			const { id } = roleIDSchema.parse(req.params);
			const permissions = removePermissionsSchema.parse(req.body);

			if (!(await RoleService.existsByID(id))) {
				return res.status(404).json({
					success: false,
					message: 'Role not found',
				});
			}

			const updated = await RoleService.removePermissions(id, permissions);

			res.json({
				success: true,
				data: updated,
			});
		} catch (err) {
			next(err);
		}
	},
};
