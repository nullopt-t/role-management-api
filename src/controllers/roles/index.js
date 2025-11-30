var RoleService = require('../../services/role');
var { createRoleSchema } = require('./validator');

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
			const role = await RoleService.getRoleByID(req.params.id);
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
};
