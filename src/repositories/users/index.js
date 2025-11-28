var { User } = require('../../models');
var user = require('../../models/user');
var { Types } = require('mongoose');
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
	create(data) {
		return User.create(data);
	},
	update(id, data) {
		return User.findOneAndUpdate(new Types.ObjectId(id), data, { new: true });
	},
	exists(id) {
		return User.exists(new Types.ObjectId(id));
	},
};
