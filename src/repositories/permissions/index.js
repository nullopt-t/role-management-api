var { Permission } = require('../../models');

module.exports = {
	findAll() {
		return Permission.find().lean();
	},
};
