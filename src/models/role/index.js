var { Types, Schema } = require('mongoose');
var con = require('../../configs/mongoose');

const RoleSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		description: { type: String, required: true },
		permissions: [
			{
				type: Types.ObjectId,
				ref: 'Permission',
				set: (v) => (typeof v === 'string' ? new Types.ObjectId(v) : v),
			},
		],
	},
	{ timestamps: true }
);

module.exports = con.model('Role', RoleSchema);
