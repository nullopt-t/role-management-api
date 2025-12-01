var RoleService = require('../../services/role');
var { 
	createRoleSchema,
	getRoleByIDSchema 
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
			if(!role){
				return res.status(404).json({
					success: false,
					message: 'Not Found'
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
};
