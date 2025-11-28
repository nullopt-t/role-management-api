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
	findById(id) {
		return User.findById(id)
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
