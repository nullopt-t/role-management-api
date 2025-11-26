var { Types, Schema } = require('mongoose');

const RoleSchema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		permissions: [{ type: Types.ObjectId, ref: 'Permission' }],
	},
	{ timestamps: true }
);

module.exports = RoleSchema;
