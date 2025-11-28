var zod = require('zod');
const LIMIT_MAX_LENGTH = 20;
module.exports = {
	getAllQuerySchema: zod.object({
		offset: zod.number().min(0).default(0),
		limit: zod.number().min(1).max(LIMIT_MAX_LENGTH).default(10),
	}),
	getByIDParameterSchema: zod.object({
		id: zod.uuid(),
	}),
};
