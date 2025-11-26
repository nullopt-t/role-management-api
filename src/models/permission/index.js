var { Schema, model } = require('mongoose');

const PermissionSchema = new Schema(
	{
		action: { type: String, required: true },
		resource: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = model('Permission', PermissionSchema);
