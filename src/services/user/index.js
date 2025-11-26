var { findAll } = require('../../repositories/users');

module.exports = {
	getUsers(offset, limit) {
		return findAll(offset, limit);
	},
};
