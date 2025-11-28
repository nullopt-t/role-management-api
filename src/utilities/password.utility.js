var { hash } = require('bcrypt');

module.exports = {
	hashPassword(password) {
		return hash(password, 10);
	},
};
