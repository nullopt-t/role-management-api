var { Role } = require('../../models');

module.exports = {
	findAll() {
		return Role.find({}).populate('permissions').lean();
	},
	findById(id) {
		return Role.findById(id).populate('permissions').lean();
	},
	create(data) {
		return Role.create(data);
	},
	async addPermissions(id, permissions) {
		return Role.findByIdAndUpdate(
			id,
			{ $addToSet: { permissions: { $each: permissions } } },
			{ new: true }
		)
			.populate('permissions')
			.lean();
	},
	async removePermissions(id, permissions) {
		return Role.findByIdAndUpdate(
			id,
			{ $pull: { permissions: { $in: permissions } } },
			{ new: true }
		)
			.populate('permissions')
			.lean();
	},
	update(id, data) {
		return Role.findByIdAndUpdate(id, data, { new: true })
			.populate('permissions')
			.lean();
	},
	delete(id) {
		return Role.findByIdAndDelete(id);
	},
	existsByID(id) {
		return Role.exists({ _id: id });
	},
	existsByName(name) {
		return Role.exists({ name });
	},
	findByName(name) {
		return Role.findOne({ name }).populate('permissions').lean();
	},
};
