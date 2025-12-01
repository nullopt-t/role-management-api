var zod = require('zod');
var { Types } = require('mongoose');

module.exports = {
	roleIDSchema: zod.object({
		id: zod.string().superRefine((val, ctx) => {
			if (!Types.ObjectId.isValid(val)) {
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
				});
			}
		}),
	}),
	updateRoleByIDBodySchema: zod
		.object({
			name: zod.string().optional(),
			description: zod.string().optional(),
		})
		.strict(),
	getRoleByIDSchema: zod.object({
		id: zod.string().superRefine((val, ctx) => {
			if (!Types.ObjectId.isValid(val)) {
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
				});
			}
		}),
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
	addPermissionsSchema: zod.array(zod.string()).superRefine((arr, ctx) => {
		if (!arr || arr.length === 0) {
			ctx.addIssue({
				code: 'empty_permissions',
				message: 'You must provide at least one permission to add',
				path: [],
			});
		}

		arr.forEach((val, i) => {
			if (!Types.ObjectId.isValid(val)) {
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
					path: [i],
				});
			}
		});
	}),
	removePermissionsSchema: zod.array(zod.string()).superRefine((arr, ctx) => {
		if (!arr || arr.length === 0) {
			ctx.addIssue({
				code: 'empty_permissions',
				message: 'You must provide at least one permission to remove',
				path: [],
			});
		}

		arr.forEach((val, i) => {
			if (!Types.ObjectId.isValid(val)) {
				ctx.addIssue({
					code: 'invalid_uuid',
					message: 'Invalid Object ID',
					path: [i],
				});
			}
		});
	}),
};
