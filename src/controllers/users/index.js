var { getUsers } = require('../../services/user');
module.exports = {
	async getAll(req, res) {
		const limit = req.params.limit || 10;
		const offset = req.params.offset || 0;
		const data = await getUsers(offset, limit);
		res.json({
			data,
		});
	},
};
