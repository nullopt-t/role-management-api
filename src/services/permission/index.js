var PermissionRepository = require('../../repositories/permissions');
var { mapPermissionToDTO } = require('../../utilities/dto.utility');
var ApiError = require('../../utilities/api-error.utility');

module.exports = {
	// Read Operations
	async getPermissions() {
		const permissions = await PermissionRepository.findAllPermissions();
		return permissions.map(mapPermissionToDTO);
	},

	async getPermissionsIncludingInactive() {
		const permissions =
			await PermissionRepository.findAllPermissionsIncludingInactive();
		return permissions.map(mapPermissionToDTO);
	},

	async getPermissionByID(id) {
		const permission = await PermissionRepository.findPermissionById(id);
		return mapPermissionToDTO(permission);
	},

	async getPermissionByActionAndResource(action, resource) {
		if (!action || !resource) {
			throw new ApiError(400, 'Action and resource are required');
		}
		const permission = await PermissionRepository.findByActionAndResource(
			action,
			resource
		);
		return mapPermissionToDTO(permission);
	},

	async findByAction(action) {
		if (!action) {
			throw new ApiError(400, 'Action is required');
		}
		const permissions = await PermissionRepository.findByAction(action);
		return permissions.map(mapPermissionToDTO);
	},

	async findByResource(resource) {
		if (!resource) {
			throw new ApiError(400, 'Resource is required');
		}
		const permissions = await PermissionRepository.findByResource(resource);
		return permissions.map(mapPermissionToDTO);
	},

	// Create Operation
	async createPermission(data) {
		if (!data.action || !data.resource || !data.description) {
			throw new ApiError(400, 'Action, resource, and description are required');
		}
		const permission = await PermissionRepository.createPermission(data);
		return mapPermissionToDTO(permission);
	},

	// Update Operation
	async updatePermission(id, data) {
		const permission = await PermissionRepository.updatePermission(id, data);
		return mapPermissionToDTO(permission);
	},

	// Delete Operations
	async deletePermission(id) {
		const permission = await PermissionRepository.delete(id);
		return mapPermissionToDTO(permission);
	},

	async softDeletePermission(id) {
		const permission = await PermissionRepository.softDeletePermission(id);
		return mapPermissionToDTO(permission);
	},

	async restorePermission(id) {
		const permission = await PermissionRepository.restorePermission(id);
		return mapPermissionToDTO(permission);
	},

	// Statistics & Analysis
	async getStats() {
		return PermissionRepository.getStats();
	},

	async getUniqueActions() {
		return PermissionRepository.getUniqueActions();
	},

	async getUniqueResources() {
		return PermissionRepository.getUniqueResources();
	},

	// Utility
	async getActionResourceMap() {
		const permissions = await this.getPermissions();
		const map = {};

		permissions.forEach((perm) => {
			if (!map[perm.action]) {
				map[perm.action] = [];
			}
			map[perm.action].push(perm.resource);
		});

		return map;
	},

	async checkPermissionExists(action, resource) {
		if (!action || !resource) {
			throw new ApiError(400, 'Action and resource are required');
		}
		const permission = await PermissionRepository.findByActionAndResource(
			action,
			resource
		);
		return !!permission;
	},

	async bulkCreatePermissions(permissionsData) {
		if (!Array.isArray(permissionsData) || permissionsData.length === 0) {
			throw new ApiError(400, 'Invalid permissions data');
		}

		const created = [];
		for (const data of permissionsData) {
			const permission = await this.createPermission(data);
			created.push(permission);
		}

		return created;
	},
};
