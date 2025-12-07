/**
 * Common schema validation patterns and utilities
 */

const commonPatterns = {
	// Username: alphanumeric and underscore, 3-30 chars
	username: /^[a-zA-Z0-9_]{3,30}$/,
	
	// Email validation
	email: /^[\w.-]+@[\w.-]+\.\w+$/,

	// Action/Resource: lowercase alphanumeric and underscore
	action: /^[a-z0-9_]+$/,
	resource: /^[a-z0-9_]+$/,
};

const fieldConstraints = {
	username: {
		minlength: 3,
		maxlength: 30,
	},
	email: {
		// MongoDB doesn't have maxlength for email, but API should enforce
		minlength: 5,
		maxlength: 255,
	},
	password: {
		minlength: 8,
		maxlength: 128,
	},
	roleName: {
		minlength: 2,
		maxlength: 50,
	},
	roleDescription: {
		minlength: 5,
		maxlength: 500,
	},
	permissionAction: {
		minlength: 2,
		maxlength: 50,
	},
	permissionResource: {
		minlength: 2,
		maxlength: 50,
	},
	permissionDescription: {
		minlength: 5,
		maxlength: 300,
	},
};

const errorMessages = {
	username: {
		required: 'Username is required',
		invalid: 'Username must be alphanumeric or underscore',
		minlength: `Username must be at least ${fieldConstraints.username.minlength} characters`,
		maxlength: `Username must not exceed ${fieldConstraints.username.maxlength} characters`,
	},
	email: {
		required: 'Email is required',
		invalid: 'Invalid email format',
		minlength: `Email must be at least ${fieldConstraints.email.minlength} characters`,
		maxlength: `Email must not exceed ${fieldConstraints.email.maxlength} characters`,
	},
	password: {
		required: 'Password is required',
		minlength: `Password must be at least ${fieldConstraints.password.minlength} characters`,
	},
	roleName: {
		required: 'Role name is required',
		minlength: `Role name must be at least ${fieldConstraints.roleName.minlength} characters`,
		maxlength: `Role name must not exceed ${fieldConstraints.roleName.maxlength} characters`,
	},
	roleDescription: {
		required: 'Role description is required',
		minlength: `Description must be at least ${fieldConstraints.roleDescription.minlength} characters`,
		maxlength: `Description must not exceed ${fieldConstraints.roleDescription.maxlength} characters`,
	},
};

module.exports = {
	commonPatterns,
	fieldConstraints,
	errorMessages,
};
