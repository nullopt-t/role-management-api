var zod = require('zod');
var { Types } = require('mongoose');

module.exports = {
	getAllQuerySchema: zod.object({
		page: zod.coerce.number().int().min(1).default(1),
		pageSize: zod.coerce.number().int().min(1).max(100).default(20),
		search: zod.string().trim().optional(),
		role: zod.string().trim().optional(),
		emailVerified: zod.coerce.boolean().optional(),
	}),
	getByIDParameterSchema: zod.object({
		id: zod.string().refine((val) => Types.ObjectId.isValid(val), {
			message: 'Invalid id',
		}),
	}),
	createBodySchema: zod.object({
		username: zod
			.string()
			.trim()
			.regex(/^[a-zA-Z0-9_]{3,30}$/),
		email: zod.string().email(),
		password: zod.string().min(8),
		roles: zod
			.array(
				zod.string().refine((val) => Types.ObjectId.isValid(val), {
					message: 'Invalid id',
				})
			)
			.optional(),
	}),
	updateParameterSchema: zod.object({
		id: zod.string().refine((val) => Types.ObjectId.isValid(val), {
			message: 'Invalid id',
		}),
	}),
	updateBodySchema: zod
		.object({
			username: zod.string().trim().optional(),
		})
		.strict(),
};
