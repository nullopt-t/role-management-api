var { Schema } = require('mongoose');
var { getConnection } = require('../../configs/mongoose');

const PermissionSchema = new Schema(
	{
		action: {
			type: String,
			required: true,
			trim: true,
			minlength: [2, 'Action must be at least 2 characters'],
			maxlength: [50, 'Action must not exceed 50 characters'],
			lowercase: true,
		},
		resource: {
			type: String,
			required: true,
			trim: true,
			minlength: [2, 'Resource must be at least 2 characters'],
			maxlength: [50, 'Resource must not exceed 50 characters'],
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
			minlength: [5, 'Description must be at least 5 characters'],
			maxlength: [300, 'Description must not exceed 300 characters'],
		},
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// Compound unique index on action + resource
PermissionSchema.index({ action: 1, resource: 1 }, { unique: true });

// Index for active permissions
PermissionSchema.index({ isActive: 1 });

module.exports = getConnection().model('Permission', PermissionSchema);
