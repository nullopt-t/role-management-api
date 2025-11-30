var { User } = require('../../models');

module.exports = {
	async findAll(page = 1, pageSize = 10, filters = {}) {
		const { search, role, emailVerified } = filters;
		const filter = {};

		if (search) {
			filter.$or = [
				{ username: { $regex: search, $options: 'i' } },
				{ email: { $regex: search, $options: 'i' } },
			];
		}

		if (role) {
			filter.roles = role;
		}

		if (typeof emailVerified === 'boolean') {
			filter.emailVerified = emailVerified;
		}

		const skip = (page - 1) * pageSize;

		const [items, total] = await Promise.all([
			User.find(filter)
				.skip(skip)
				.limit(pageSize)
				.populate({
					path: 'roles',
					populate: { path: 'Permission' },
					strictPopulate: false,
				})
				.lean(),
			User.countDocuments(filter),
		]);

		return {
			items,
			page,
			pageSize,
			total,
			totalPages: Math.ceil(total / pageSize),
		};
	},
	findById(id) {
		return User.findById(id)
			.populate({
				path: 'Role',
				populate: {
					path: 'Permission',
				},
				strictPopulate: false,
			})
			.lean();
	},
	create(data) {
		return User.create(data);
	},
	update(id, data) {
		return User.findByIdAndUpdate(id, data, { new: true });
	},
	delete(id) {
		return User.findByIdAndDelete(id);
	},
	exists(id) {
		return User.exists({ _id: id });
	},
};
