var RoleRepository = require('../../repositories/roles');

module.exports = {
	getRoles() {
		return RoleRepository.findAll();
	},
	getRoleByID(id) {
		return RoleRepository.findById(id);
	},
	getRoleByName(name) {
		return RoleRepository.findByName(name);
	},
	createRole(role) {
		return RoleRepository.create(role);
	},
	updateRole(id, role) {
		return RoleRepository.update(id, role);
	},
	deleteRole(id) {
		return RoleRepository.delete(id);
	},
	existsByID(id) {
		return RoleRepository.existsByID(id);
	},
	existsByName(name) {
		return RoleRepository.existsByName(name);
	},
};
