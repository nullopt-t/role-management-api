var { getUsers, getUserByID } = require('../../services/user');
var {
	getAllQuerySchema,
	getByIDParameterSchema,
} = require('../../controllers/users/validator');

module.exports = {
	async getAll(req, res) {
		const { offset, limit } = getAllQuerySchema.parse(req.query);
		const data = await getUsers(offset, limit);
		res.json({
			data,
		});
	},
	async getByID(req, res, next) {
		try {
			const { id } = getByIDParameterSchema.parse(req.params);
			const user = await getUserByID(id);
			res.json({
				data: user,
			});
		} catch (err) {
			next(err);
		}
	},
};
