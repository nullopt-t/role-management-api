var { Schema, Types } = require('mongoose');
var con = require('../../configs/mongoose');

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			match: [/^[a-zA-Z0-9_]+$/, 'invalid username format'],
		},
		email: {
			type: String,
			required: true,
			match: [/^[\w.-]+@[\w.-]+\.\w+$/, 'invalid email format'],
		},
		password: {
			type: String,
			required: true,
		},
		roles: [{ type: Types.ObjectId, ref: 'Role' }],
	},
	{ timestamps: true }
);

module.exports = con.model('User', UserSchema);
