var UserRepository = require('../../repositories/users');
var RoleService = require('../role');
var { mapUserToDTO } = require('../../utilities/dto.utility');

module.exports = {
	// Read Operations
	async getUsers(page, pageSize, filters) {
		// If role filter is by name, resolve to ID first
		const processedFilters = { ...filters };
		if (
			filters.role &&
			typeof filters.role === 'string' &&
			isNaN(filters.role)
		) {
			// Treat as role name, resolve to ID via RoleService
			const roleId = await RoleService.getRoleIdByName(filters.role);
			if (!roleId) {
				// Role not found, return empty results
				return {
					items: [],
					page,
					pageSize,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				};
			}
			processedFilters.role = roleId;
		}

		const result = await UserRepository.findAllUsers({
			...processedFilters,
			page,
			pageSize,
		});
		return {
			...result,
			items: result.items.map(mapUserToDTO),
		};
	},

	async getUserByID(id) {
		const user = await UserRepository.findUserById(id);
		return mapUserToDTO(user);
	},

	async findByEmail(email) {
		const user = await UserRepository.findByEmail(email);
		return mapUserToDTO(user);
	},

	async findByUsername(username) {
		const user = await UserRepository.findByUsername(username);
		return mapUserToDTO(user);
	},

	// Create Operation
	async createUser(data) {
		const newUser = await UserRepository.create(data);
		return mapUserToDTO(newUser);
	},

	// Update Operation
	async updateUser(id, data) {
		const updatedUser = await UserRepository.updateUser(id, data);
		return mapUserToDTO(updatedUser);
	},

	// Delete Operations
	async deleteUser(id) {
		const deletedUser = await UserRepository.delete(id);
		return mapUserToDTO(deletedUser);
	},

	async softDeleteUser(id) {
		const deletedUser = await UserRepository.softDeleteUser(id);
		return mapUserToDTO(deletedUser);
	},

	async restoreUser(id) {
		const restoredUser = await UserRepository.restoreUser(id);
		return mapUserToDTO(restoredUser);
	},

	// Existence Checks
	async existsById(id) {
		return UserRepository.existsById(id);
	},

	async existsByEmail(email) {
		return UserRepository.existsByEmail(email);
	},

	async existsByUsername(username) {
		return UserRepository.existsByUsername(username);
	},

	// Bulk Operations
	async getAllActive() {
		const users = await UserRepository.findAllActive();
		return users.map(mapUserToDTO);
	},

	// Role Management
	async assignRoles(userId, roleIds) {
		if (!Array.isArray(roleIds) || roleIds.length === 0) {
			throw new Error('Invalid roleIds provided');
		}
		const user = await UserRepository.updateUser(userId, {
			roles: roleIds,
		});
		return mapUserToDTO(user);
	},

	async addRoles(userId, roleIds) {
		if (!Array.isArray(roleIds) || roleIds.length === 0) {
			throw new Error('Invalid roleIds provided');
		}
		const user = await UserRepository.update(userId, {
			$addToSet: { roles: { $each: roleIds } },
		});
		return mapUserToDTO(user);
	},

	async removeRoles(userId, roleIds) {
		if (!Array.isArray(roleIds) || roleIds.length === 0) {
			throw new Error('Invalid roleIds provided');
		}
		const user = await UserRepository.update(userId, {
			$pull: { roles: { $in: roleIds } },
		});
		return mapUserToDTO(user);
	},

	// Verification
	async verifyEmail(userId) {
		const user = await UserRepository.updateUser(userId, {
			emailVerified: true,
		});
		return mapUserToDTO(user);
	},

	async updateLastLogin(userId) {
		const user = await UserRepository.updateUser(userId, {
			lastLogin: new Date(),
		});
		return mapUserToDTO(user);
	},

	// Utility
	async getStats() {
		const total = await UserRepository.count({});
		const active = await UserRepository.count({ isActive: true });
		const inactive = await UserRepository.count({ isActive: false });
		const verified = await UserRepository.count({ emailVerified: true });
		const unverified = await UserRepository.count({ emailVerified: false });

		return {
			total,
			active,
			inactive,
			verified,
			unverified,
			verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
			activityRate: total > 0 ? ((active / total) * 100).toFixed(2) : 0,
		};
	},
};
