var UserRepository = require('../../repositories/users');

module.exports = {
	async getUsers(page, pageSize, filters) {
		const result = await UserRepository.findAll(page, pageSize, filters);
		return {
			...result,
			items: result.items.map((u) => ({
				id: u._id,
				username: u.username,
				email: u.email,
				emailVerified: u.emailVerified,
				roles: u.roles,
				createdAt: u.createdAt,
				updatedAt: u.updatedAt,
			})),
		};
	},
	async getUserByID(id) {
		const user = await UserRepository.findById(id);
		return user
			? {
					id: user._id,
					username: user.username,
					email: user.email,
					emailVerified: user.emailVerified,
					roles: user.roles,
					createdAt: user.createdAt,
					updatedAt: user.updatedAt,
			  }
			: null;
	},
	async createUser(data) {
		const newUser = await UserRepository.create(data);
		return {
			id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			emailVerified: newUser.emailVerified,
			roles: newUser.roles,
			createdAt: newUser.createdAt,
			updatedAt: newUser.updatedAt,
		};
	},
	async updateUser(id, data) {
		const updatedUser = await UserRepository.update(id, data);
		return {
			id: updatedUser._id,
			username: updatedUser.username,
			email: updatedUser.email,
			emailVerified: updatedUser.emailVerified,
			roles: updatedUser.roles,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
		};
	},
	async deleteUser(id) {
		const deletedUser = await UserRepository.delete(id);
		return {
			id: deletedUser._id,
			username: deletedUser.username,
			email: deletedUser.email,
			emailVerified: deletedUser.emailVerified,
			roles: deletedUser.roles,
			createdAt: deletedUser.createdAt,
			updatedAt: deletedUser.updatedAt,
		};
	},
	exists(id) {
		return UserRepository.exists(id);
	},
};
