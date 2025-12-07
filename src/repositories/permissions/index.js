var { Permission } = require('../../models');
var BaseRepository = require('../base.repository');

class PermissionRepository extends BaseRepository {
	constructor() {
		super(Permission);
	}

	/**
	 * Find all active permissions
	 * @returns {Promise<Array>}
	 */
	async findAllPermissions() {
		const result = await this.findAll({
			filters: { isActive: true },
			sort: { action: 1, resource: 1 },
		});
		return result.items;
	}

	/**
	 * Find all permissions including inactive
	 * @returns {Promise<Array>}
	 */
	async findAllPermissionsIncludingInactive() {
		const result = await this.findAll({
			filters: {},
			sort: { action: 1, resource: 1 },
		});
		return result.items;
	}

	/**
	 * Find permission by ID
	 * @param {string} id - Permission ID
	 * @returns {Promise<Object|null>}
	 */
	async findPermissionById(id) {
		return this.findById(id);
	}

	/**
	 * Find permission by action and resource
	 * @param {string} action - Action name
	 * @param {string} resource - Resource name
	 * @returns {Promise<Object|null>}
	 */
	async findByActionAndResource(action, resource) {
		return this.findOne({
			action: action.toLowerCase(),
			resource: resource.toLowerCase(),
			isActive: true,
		});
	}

	/**
	 * Find permission by action and resource (including inactive)
	 * @param {string} action - Action name
	 * @param {string} resource - Resource name
	 * @returns {Promise<Object|null>}
	 */
	async findByActionAndResourceIncludingInactive(action, resource) {
		return this.findOne({
			action: action.toLowerCase(),
			resource: resource.toLowerCase(),
		});
	}

	/**
	 * Create permission with normalized action/resource
	 * @param {Object} data - Permission data
	 * @returns {Promise<Object>}
	 */
	async createPermission(data) {
		return this.create({
			...data,
			action: data.action.toLowerCase().trim(),
			resource: data.resource.toLowerCase().trim(),
		});
	}

	/**
	 * Check if permission exists by ID
	 * @param {string} id - Permission ID
	 * @returns {Promise<boolean>}
	 */
	async existsById(id) {
		return this.exists({ _id: id });
	}

	/**
	 * Check if permission exists by action and resource
	 * @param {string} action - Action name
	 * @param {string} resource - Resource name
	 * @returns {Promise<boolean>}
	 */
	async existsByActionAndResource(action, resource) {
		return this.exists({
			action: action.toLowerCase(),
			resource: resource.toLowerCase(),
		});
	}

	/**
	 * Update permission
	 * @param {string} id - Permission ID
	 * @param {Object} data - Update data
	 * @returns {Promise<Object|null>}
	 */
	async updatePermission(id, data) {
		// Normalize action/resource if provided
		if (data.action) {
			data.action = data.action.toLowerCase().trim();
		}
		if (data.resource) {
			data.resource = data.resource.toLowerCase().trim();
		}
		return this.update(id, data);
	}

	/**
	 * Soft delete permission
	 * @param {string} id - Permission ID
	 * @returns {Promise<Object|null>}
	 */
	async softDeletePermission(id) {
		return this.softDelete(id);
	}

	/**
	 * Restore soft-deleted permission
	 * @param {string} id - Permission ID
	 * @returns {Promise<Object|null>}
	 */
	async restorePermission(id) {
		return this.restore(id);
	}

	/**
	 * Get all unique actions
	 * @returns {Promise<Array>}
	 */
	async getUniqueActions() {
		return this.getDistinct('action', { isActive: true });
	}

	/**
	 * Get all unique resources
	 * @returns {Promise<Array>}
	 */
	async getUniqueResources() {
		return this.getDistinct('resource', { isActive: true });
	}

	/**
	 * Find permissions by action
	 * @param {string} action - Action name
	 * @returns {Promise<Array>}
	 */
	async findByAction(action) {
		const result = await this.findAll({
			filters: {
				action: action.toLowerCase(),
				isActive: true,
			},
			sort: { resource: 1 },
		});
		return result.items;
	}

	/**
	 * Find permissions by resource
	 * @param {string} resource - Resource name
	 * @returns {Promise<Array>}
	 */
	async findByResource(resource) {
		const result = await this.findAll({
			filters: {
				resource: resource.toLowerCase(),
				isActive: true,
			},
			sort: { action: 1 },
		});
		return result.items;
	}

	/**
	 * Get permission statistics
	 * @returns {Promise<Object>}
	 */
	async getStats() {
		const [total, active, inactive, uniqueActions, uniqueResources] =
			await Promise.all([
				this.count({}),
				this.count({ isActive: true }),
				this.count({ isActive: false }),
				this.getUniqueActions(),
				this.getUniqueResources(),
			]);

		return {
			total,
			active,
			inactive,
			uniqueActionsCount: uniqueActions.length,
			uniqueResourcesCount: uniqueResources.length,
			uniqueActions,
			uniqueResources,
		};
	}
}

module.exports = new PermissionRepository();
