var { Role } = require('../../models');
var BaseRepository = require('../base.repository');

class RoleRepository extends BaseRepository {
	constructor() {
		super(Role);
	}

	/**
	 * Find all active roles with permissions
	 * @returns {Promise<Array>}
	 */
	async findAllRoles() {
		const result = await this.findAll({
			filters: { isActive: true },
			populate: ['permissions'],
		});
		return result.items;
	}

	/**
	 * Find all roles including inactive
	 * @returns {Promise<Array>}
	 */
	async findAllRolesIncludingInactive() {
		const result = await this.findAll({
			filters: {},
			populate: ['permissions'],
		});
		return result.items;
	}

	/**
	 * Find role by ID with permissions
	 * @param {string} id - Role ID
	 * @returns {Promise<Object|null>}
	 */
	async findRoleById(id) {
		return this.findById(id, {
			populate: ['permissions'],
		});
	}

	/**
	 * Find role by name (active only)
	 * @param {string} name - Role name
	 * @returns {Promise<Object|null>}
	 */
	async findByName(name) {
		return this.findOne(
			{ name: name.toLowerCase(), isActive: true },
			{
				populate: ['permissions'],
			}
		);
	}

	/**
	 * Find role by name (including inactive)
	 * @param {string} name - Role name
	 * @returns {Promise<Object|null>}
	 */
	async findByNameIncludingInactive(name) {
		return this.findOne(
			{ name: name.toLowerCase() },
			{
				populate: ['permissions'],
			}
		);
	}

	/**
	 * Check if role exists by ID
	 * @param {string} id - Role ID
	 * @returns {Promise<boolean>}
	 */
	async existsById(id) {
		return this.exists({ _id: id });
	}

	/**
	 * Check if role exists by name
	 * @param {string} name - Role name
	 * @returns {Promise<boolean>}
	 */
	async existsByName(name) {
		return this.exists({ name: name.toLowerCase() });
	}

	/**
	 * Add permissions to role
	 * @param {string} id - Role ID
	 * @param {Array<string>} permissionIds - Permission IDs
	 * @returns {Promise<Object|null>}
	 */
	async addPermissions(id, permissionIds) {
		return this.update(
			id,
			{ $addToSet: { permissions: { $each: permissionIds } } },
			{
				populate: ['permissions'],
			}
		);
	}

	/**
	 * Remove permissions from role
	 * @param {string} id - Role ID
	 * @param {Array<string>} permissionIds - Permission IDs
	 * @returns {Promise<Object|null>}
	 */
	async removePermissions(id, permissionIds) {
		return this.update(
			id,
			{ $pull: { permissions: { $in: permissionIds } } },
			{
				populate: ['permissions'],
			}
		);
	}

	/**
	 * Update role
	 * @param {string} id - Role ID
	 * @param {Object} data - Update data
	 * @returns {Promise<Object|null>}
	 */
	async updateRole(id, data) {
		return this.update(id, data, {
			populate: ['permissions'],
		});
	}

	/**
	 * Soft delete role
	 * @param {string} id - Role ID
	 * @returns {Promise<Object|null>}
	 */
	async softDeleteRole(id) {
		return this.softDelete(id, {
			populate: ['permissions'],
		});
	}

	/**
	 * Restore soft-deleted role
	 * @param {string} id - Role ID
	 * @returns {Promise<Object|null>}
	 */
	async restoreRole(id) {
		return this.restore(id, {
			populate: ['permissions'],
		});
	}

	/**
	 * Get role data for existence check
	 * @param {string} id - Role ID
	 * @returns {Promise<Object|null>}
	 */
	async getRoleDataById(id) {
		return this.findById(id, {
			populate: ['permissions'],
		});
	}

	/**
	 * Get role data by name for existence check
	 * @param {string} name - Role name
	 * @returns {Promise<Object|null>}
	 */
	async getRoleDataByName(name) {
		return this.findOne(
			{ name: name.toLowerCase() },
			{
				populate: ['permissions'],
			}
		);
	}

	/**
	 * Get role ID by name (low-level lookup, no DTO conversion)
	 * Used internally for filtering operations to avoid circular dependencies
	 * @param {string} name - Role name
	 * @returns {Promise<string|null>}
	 */
	async getRoleIdByName(name) {
		const role = await this.findOne({ name: name.toLowerCase() });
		return role ? role._id.toString() : null;
	}
}

module.exports = new RoleRepository();
