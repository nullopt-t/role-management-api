var { Schema } = require('mongoose');

const UserSchema = new Schema({
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
});

module.exports = UserSchema;
