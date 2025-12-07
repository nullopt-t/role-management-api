var { User } = require('../../models');
var BaseRepository = require('../base.repository');

class UserRepository extends BaseRepository {
	constructor() {
		super(User);
	}

	/**
	 * Find all users with advanced filtering
	 * @param {Object} options - Query options
	 * @returns {Promise<Object>} Paginated users
	 */
	async findAllUsers(options = {}) {
		const {
			search,
			role,
			emailVerified,
			isActive = true,
			page = 1,
			pageSize = 10,
		} = options;

		const filters = {};

		// Apply search on multiple fields
		if (search) {
			filters.$or = [
				{ username: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
			];
		}

		// Apply role filter (expects roleId, not role name)
		// Role name resolution should be done in the service layer
		if (role) {
			filters.roles = { $in: [role] };
		}

		// Apply email verification filter
		if (typeof emailVerified === 'boolean') {
			filters.emailVerified = emailVerified;
		}

		// Apply active status filter
		if (typeof isActive === 'boolean') {
			filters.isActive = isActive;
		}

		return this.findAll({
			filters,
			page,
			pageSize,
			populate: [
				{
					path: 'roles',
					populate: { path: 'permissions' },
					strictPopulate: false,
				},
			],
			sort: { createdAt: -1 },
		});
	}

	/**
	 * Find user by ID with populated roles and permissions
	 * @param {string} id - User ID
	 * @returns {Promise<Object|null>}
	 */
	async findUserById(id) {
		return this.findById(id, {
			populate: [
				{
					path: 'roles',
					populate: {
						path: 'permissions',
					},
					strictPopulate: false,
				},
			],
		});
	}

	/**
	 * Find user by email
	 * @param {string} email - Email address
	 * @returns {Promise<Object|null>}
	 */
	async findByEmail(email) {
		return this.findOne({ email: email.toLowerCase() });
	}

	/**
	 * Find user by username
	 * @param {string} username - Username
	 * @returns {Promise<Object|null>}
	 */
	async findByUsername(username) {
		return this.findOne({ username: username.toLowerCase() });
	}

	/**
	 * Find all active users
	 * @returns {Promise<Array>}
	 */
	async findAllActive() {
		const result = await this.findAll({
			filters: { isActive: true },
			populate: [
				{
					path: 'roles',
					populate: { path: 'permissions' },
					strictPopulate: false,
				},
			],
		});
		return result.items;
	}

	/**
	 * Check if user exists by ID
	 * @param {string} id - User ID
	 * @returns {Promise<boolean>}
	 */
	async existsById(id) {
		return this.exists({ _id: id });
	}

	/**
	 * Check if email exists
	 * @param {string} email - Email address
	 * @returns {Promise<boolean>}
	 */
	async existsByEmail(email) {
		return this.exists({ email: email.toLowerCase() });
	}

	/**
	 * Check if username exists
	 * @param {string} username - Username
	 * @returns {Promise<boolean>}
	 */
	async existsByUsername(username) {
		return this.exists({ username: username.toLowerCase() });
	}

	/**
	 * Update user with role population
	 * @param {string} id - User ID
	 * @param {Object} data - Update data
	 * @returns {Promise<Object|null>}
	 */
	async updateUser(id, data) {
		return this.update(id, data, {
			populate: [
				{
					path: 'roles',
					populate: { path: 'permissions' },
					strictPopulate: false,
				},
			],
		});
	}

	/**
	 * Soft delete user
	 * @param {string} id - User ID
	 * @returns {Promise<Object|null>}
	 */
	async softDeleteUser(id) {
		return this.softDelete(id, {
			populate: [
				{
					path: 'roles',
					populate: { path: 'permissions' },
					strictPopulate: false,
				},
			],
		});
	}

	/**
	 * Restore soft-deleted user
	 * @param {string} id - User ID
	 * @returns {Promise<Object|null>}
	 */
	async restoreUser(id) {
		return this.restore(id, {
			populate: [
				{
					path: 'roles',
					populate: { path: 'permissions' },
					strictPopulate: false,
				},
			],
		});
	}
}

module.exports = new UserRepository();
