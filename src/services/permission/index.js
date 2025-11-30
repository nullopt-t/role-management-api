var PermissionRepository = require('../../repositories/permissions');

module.exports = {
	getPermissions() {
		return PermissionRepository.findAll();
	},
};
