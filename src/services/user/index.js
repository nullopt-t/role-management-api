var { findAll, findById } = require('../../repositories/users');

module.exports = {
	getUsers(offset, limit) {
		return findAll(offset, limit);
	},
	getUserByID(id) {
		return findById(id);
	},
};
