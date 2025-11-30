var PermissionService = require('../../services/permission');

module.exports = {
	async getPermissions(req, res, next) {
		try {
			const permissions = await PermissionService.getPermissions(req);
			res.json({ data: permissions });
		} catch (error) {
			next(error);
		}
	},
};
