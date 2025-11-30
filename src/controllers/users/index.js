var UserService = require('../../services/user');
var {
	getAllQuerySchema,
	getByIDParameterSchema,
	createBodySchema,
	updateParameterSchema,
	updateBodySchema,
} = require('../../controllers/users/validator');
var { hashPassword } = require('../../utilities/password.utility');

module.exports = {
	async getUsers(req, res, next) {
		try {
			const { page, pageSize, search, role, emailVerified } =
				getAllQuerySchema.parse(req.query);

			const data = await UserService.getUsers(page, pageSize, {
				search,
				role,
				emailVerified,
			});

			res.json({
				page: data.page,
				pageSize: data.pageSize,
				total: data.total,
				totalPages: data.totalPages,
				data: data.items,
			});
			
		} catch (err) {
			next(err);
		}
	},
	async getUserByID(req, res, next) {
		try {
			const { id } = getByIDParameterSchema.parse(req.params);
			const user = await UserService.getUserByID(id);
			res.json({
				data: user,
			});
		} catch (err) {
			next(err);
		}
	},
	async createUser(req, res, next) {
		try {
			const data = createBodySchema.parse(req.body);
			data.password = await hashPassword(data.password);
			const user = await UserService.createUser(data);
			res.json({
				data: user,
			});
		} catch (err) {
			next(err);
		}
	},
	async updateUser(req, res, next) {
		try {
			const { id } = updateParameterSchema.parse(req.params);
			const exists = await UserService.exists(id);
			if (!exists) {
				throw new Error('User not found');
			}
			const data = updateBodySchema.parse(req.body);
			const user = await UserService.updateUser(id, data);
			res.json({
				data: user,
			});
		} catch (err) {
			next(err);
		}
	},
};
