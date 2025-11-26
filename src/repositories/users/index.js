var { User } = require('../../models');

module.exports = {
	findAll(offset, limit) {
		return User.find({})
			.skip(offset)
			.limit(limit)
			.populate({
				path: 'Role',
				populate: {
					path: 'Permission',
				},
			})
			.lean();
	},
};
