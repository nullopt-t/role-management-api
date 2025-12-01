var zod = require('zod');
var { Types } = require('mongoose');

module.exports = {
	updateRoleByIDParameterSchema: zod.object({
		id: zod.string().superRefine((val, ctx)=> {
			if(!Types.ObjectId.isValid(val)){
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
				})
			}
		})
	}),
	updateRoleByIDBodySchema: zod.object({
		name: zod.string().optional(),
		description: zod.string().optional(),
		permissions: zod.array(zod.string().superRefine((val, ctx)=> {
			if(!Types.ObjectId.isValid(val)){
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
				})
			}
		})).optional()
	}).strict(),
	getRoleByIDSchema: zod.object({
		id: zod.string().superRefine((val, ctx)=> {
			if(!Types.ObjectId.isValid(val)){
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
				})
			}
		})
	}),
	createRoleSchema: zod.object({
		name: zod.string().min(3).max(20),
		description: zod.string().min(3).max(200),
		permissions: zod.array(
			zod.string().refine((val) => Types.ObjectId.isValid(val), {
				message: 'Invalid id',
			})
		),
	}),
};
