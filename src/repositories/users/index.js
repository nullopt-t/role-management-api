var { User } = require('../../models');
var RoleService = require('../../services/role');

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
			const r = await RoleService.getRoleByName(role);
			if (!r) {
				return {
					items: [],
					page,
					pageSize,
					total: 0,
					totalPages: 0,
				};
			}
			filter.roles = { $in: [r._id.toString()] };
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
					populate: { path: 'permissions' },
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
				path: 'roles',
				populate: {
					path: 'permissions',
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
	findByEmail(email) {
		return User.findOne({ email });
	},
	findByUsername(username) {
		return User.findOne({ username });
	},
};
