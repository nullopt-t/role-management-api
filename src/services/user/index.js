var Logger = require('../../utilities/logger.utility');
var UserRepository = require('../../repositories/users');

module.exports = {
	getUsers(offset, limit) {
		return UserRepository.findAll(offset, limit);
	},
	getUserByID(id) {
		return UserRepository.findById(id);
	},
	async createUser(data) {
		const newUser = await UserRepository.create(data);
		return {
			id: newUser._id,
			username: newUser.username,
			email: newUser.email,
			emailVerified: newUser.emailVerified,
			role: newUser.roles,
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
			role: updatedUser.roles,
			createdAt: updatedUser.createdAt,
			updatedAt: updatedUser.updatedAt,
		};
	},
	exists(id) {
		return UserRepository.exists(id);
	},
};
