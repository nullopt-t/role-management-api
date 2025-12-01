var zod = require('zod');
var { Types } = require('mongoose');

module.exports = {
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
