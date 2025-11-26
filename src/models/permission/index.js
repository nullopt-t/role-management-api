var { Schema } = require('mongoose');
var con = require('../../configs/mongoose');

const PermissionSchema = new Schema(
	{
		action: { type: String, required: true },
		resource: { type: String, required: true },
		description: { type: String, required: true },
	},
	{ timestamps: true }
);

module.exports = con.model('Permission', PermissionSchema);
