var { Schema, Types } = require('mongoose');
var { getConnection } = require('../../configs/mongoose');

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: [3, 'Username must be at least 3 characters'],
			maxlength: [30, 'Username must not exceed 30 characters'],
			match: [/^[a-zA-Z0-9_]+$/, 'invalid username format'],
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^[\w.-]+@[\w.-]+\.\w+$/, 'invalid email format'],
			index: true,
		},
		password: {
			type: String,
			required: true,
			minlength: [8, 'Password must be at least 8 characters'],
		},
		roles: [
			{
				type: Types.ObjectId,
				ref: 'Role',
				set: (v) => (typeof v === 'string' ? new Types.ObjectId(v) : v),
			},
		],
		isActive: {
			type: Boolean,
			default: true,
			index: true,
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		lastLogin: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

// Compound index for active users search
UserSchema.index({ isActive: 1, createdAt: -1 });

module.exports = getConnection().model('User', UserSchema);
