var { Types, Schema } = require('mongoose');
var { getConnection } = require('../../configs/mongoose');

const RoleSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: [2, 'Role name must be at least 2 characters'],
			maxlength: [50, 'Role name must not exceed 50 characters'],
			index: true,
		},
		description: {
			type: String,
			required: true,
			minlength: [5, 'Description must be at least 5 characters'],
			maxlength: [500, 'Description must not exceed 500 characters'],
		},
		permissions: [
			{
				type: Types.ObjectId,
				ref: 'Permission',
				set: (v) => (typeof v === 'string' ? new Types.ObjectId(v) : v),
			},
		],
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// Compound index for active roles
RoleSchema.index({ isActive: 1, createdAt: -1 });

module.exports = getConnection().model('Role', RoleSchema);
