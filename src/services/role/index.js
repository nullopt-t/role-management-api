var RoleRepository = require('../../repositories/roles');
var {
	mapRoleToDTO,
	mapPermissionToDTO,
} = require('../../utilities/dto.utility');

module.exports = {
	// Read Operations
	async getRoles() {
		const roles = await RoleRepository.findAllRoles();
		return roles.map(mapRoleToDTO);
	},

	async getRolesIncludingInactive() {
		const roles = await RoleRepository.findAllRolesIncludingInactive();
		return roles.map(mapRoleToDTO);
	},

	async getRoleByID(id) {
		const role = await RoleRepository.findRoleById(id);
		return mapRoleToDTO(role);
	},

	async getRoleByName(name) {
		const role = await RoleRepository.findByName(name);
		return mapRoleToDTO(role);
	},

	async getRoleByNameIncludingInactive(name) {
		const role = await RoleRepository.findByNameIncludingInactive(name);
		return mapRoleToDTO(role);
	},

	// Create Operation
	async createRole(roleData) {
		if (!roleData.name || !roleData.description) {
			throw new Error('Role name and description are required');
		}
		const createdRole = await RoleRepository.create(roleData);
		return mapRoleToDTO(createdRole);
	},

	// Update Operation
	async updateRole(id, roleData) {
		const updatedRole = await RoleRepository.updateRole(id, roleData);
		return mapRoleToDTO(updatedRole);
	},

	// Delete Operations
	async deleteRole(id) {
		const deletedRole = await RoleRepository.delete(id);
		return mapRoleToDTO(deletedRole);
	},

	async softDeleteRole(id) {
		const deletedRole = await RoleRepository.softDeleteRole(id);
		return mapRoleToDTO(deletedRole);
	},

	async restoreRole(id) {
		const restoredRole = await RoleRepository.restoreRole(id);
		return mapRoleToDTO(restoredRole);
	},

	// Permission Management
	async addPermissions(id, permissionIds) {
		if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
			throw new Error('Invalid permissionIds provided');
		}
		const updatedRole = await RoleRepository.addPermissions(id, permissionIds);
		return mapRoleToDTO(updatedRole);
	},

	async removePermissions(id, permissionIds) {
		if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
			throw new Error('Invalid permissionIds provided');
		}
		const updatedRole = await RoleRepository.removePermissions(
			id,
			permissionIds
		);
		return mapRoleToDTO(updatedRole);
	},

	async setPermissions(id, permissionIds) {
		if (!Array.isArray(permissionIds)) {
			throw new Error('Invalid permissionIds provided');
		}
		const updatedRole = await RoleRepository.updateRole(id, {
			permissions: permissionIds,
		});
		return mapRoleToDTO(updatedRole);
	},

	// Existence Checks
	async existsById(id) {
		return RoleRepository.existsById(id);
	},

	async existsByName(name) {
		return RoleRepository.existsByName(name);
	},

	// Statistics
	async getStats() {
		const total = await RoleRepository.count({});
		const active = await RoleRepository.count({ isActive: true });
		const inactive = await RoleRepository.count({ isActive: false });

		return {
			total,
			active,
			inactive,
			activePercentage: total > 0 ? ((active / total) * 100).toFixed(2) : 0,
		};
	},

	// Utility
	async getPermissionsByRole(roleId) {
		const role = await RoleRepository.findRoleById(roleId);
		return (role.permissions || []).map(mapPermissionToDTO);
	},

	async hasPermission(roleId, permissionId) {
		const role = await RoleRepository.findRoleById(roleId);
		if (!role) return false;
		return (role.permissions || []).some(
			(perm) => perm._id.toString() === permissionId.toString()
		);
	},

	// Role ID Resolution (for other services)
	async getRoleIdByName(name) {
		const role = await RoleRepository.getRoleIdByName(name);
		return role;
	},
};
