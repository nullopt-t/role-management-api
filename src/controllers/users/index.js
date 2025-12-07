var UserService = require('../../services/user');
var { hashPassword } = require('../../utilities/password.utility');

var {
	sendSuccess,
	sendError,
	sendPaginated,
	checkResourceExists,
} = require('../../utilities/controller.utility');

var {
	userListQuerySchema,
	userCreateBodySchema,
	userUpdateBodySchema,
	idParamSchema,
	roleIdArrayBodySchema,
} = require('../../utilities/validation.utility');

module.exports = {
	// Get paginated users
	async getUsers(req, res, next) {
		try {
			const { page, pageSize, search, role, emailVerified, isActive } =
				userListQuerySchema.parse(req.query);

			const filters = {};
			if (search) filters.search = search;
			if (role) filters.role = role;
			if (typeof emailVerified !== 'undefined')
				filters.emailVerified = emailVerified;
			if (typeof isActive !== 'undefined') filters.isActive = isActive;

			const result = await UserService.getUsers(page, pageSize, filters);
			return sendPaginated(res, result);
		} catch (err) {
			next(err);
		}
	},

	// Get single user
	async getUserByID(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const user = await UserService.getUserByID(id);

			if (!checkResourceExists(user, res, 'User')) return;

			return sendSuccess(res, user);
		} catch (err) {
			next(err);
		}
	},

	// Get user statistics
	async getUserStats(req, res, next) {
		try {
			const stats = await UserService.getStats();
			return sendSuccess(res, stats);
		} catch (err) {
			next(err);
		}
	},

	// Create user
	async createUser(req, res, next) {
		try {
			const data = userCreateBodySchema.parse(req.body);

			// Check if user exists by email
			const existsByEmail = await UserService.existsByEmail(data.email);
			if (existsByEmail) {
				return sendError(res, 'Email already in use', 409);
			}

			// Check if user exists by username
			const existsByUsername = await UserService.existsByUsername(
				data.username
			);
			if (existsByUsername) {
				return sendError(res, 'Username already in use', 409);
			}

			data.password = await hashPassword(data.password);
			const user = await UserService.createUser(data);
			return sendSuccess(res, user, 201);
		} catch (err) {
			next(err);
		}
	},

	// Update user
	async updateUser(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const updateData = userUpdateBodySchema.parse(req.body);

			// Check user exists
			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			//Check if updating username to an existing one
			if (updateData.username) {
				const usernameInUse = await UserService.findByUsername(
					updateData.username
				);
				if (usernameInUse && usernameInUse.id !== id) {
					return sendError(res, 'Email already in use', 409);
				}
			}

			const user = await UserService.updateUser(id, updateData);
			return sendSuccess(res, user);
		} catch (err) {
			next(err);
		}
	},

	// Soft delete user
	async softDeleteUser(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.softDeleteUser(id);
			return sendSuccess(res, { message: 'User deleted', user });
		} catch (err) {
			next(err);
		}
	},

	// Restore user
	async restoreUser(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const user = await UserService.restoreUser(id);

			if (!checkResourceExists(user, res, 'User')) return;

			return sendSuccess(res, { message: 'User restored', user });
		} catch (err) {
			next(err);
		}
	},

	// Assign roles to user
	async assignRoles(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const { roleIds } = roleIdArrayBodySchema.parse(req.body);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.assignRoles(id, roleIds);
			return sendSuccess(res, { message: 'Roles assigned', user });
		} catch (err) {
			next(err);
		}
	},

	// Add roles to user
	async addRoles(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const { roleIds } = roleIdArrayBodySchema.parse(req.body);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.addRoles(id, roleIds);
			return sendSuccess(res, { message: 'Roles added', user });
		} catch (err) {
			next(err);
		}
	},

	// Remove roles from user
	async removeRoles(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);
			const { roleIds } = roleIdArrayBodySchema.parse(req.body);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.removeRoles(id, roleIds);
			return sendSuccess(res, { message: 'Roles removed', user });
		} catch (err) {
			next(err);
		}
	},

	// Verify email
	async verifyEmail(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.verifyEmail(id);
			return sendSuccess(res, { message: 'Email verified', user });
		} catch (err) {
			next(err);
		}
	},

	// Update last login
	async updateLastLogin(req, res, next) {
		try {
			const { id } = idParamSchema.parse(req.params);

			const exists = await UserService.existsById(id);
			if (!checkResourceExists(exists, res, 'User')) return;

			const user = await UserService.updateLastLogin(id);
			return sendSuccess(res, { message: 'Last login updated', user });
		} catch (err) {
			next(err);
		}
	},
};
