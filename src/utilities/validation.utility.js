const zod = require('zod');
const { Types } = require('mongoose');
const { commonPatterns, fieldConstraints } = require('./schema.utility');

/**
 * Common Zod validators for reuse across the application
 */

// Basic type validators
const objectId = zod.string().superRefine((val, ctx) => {
	if (!Types.ObjectId.isValid(val)) {
		ctx.addIssue({
			code: 'invalid_uuid',
			message: 'Invalid Object ID',
		});
	}
});

const objectIdArray = zod
	.array(objectId)
	.min(1, 'Must provide at least one ID');

// Pagination validators
const pagination = {
	page: zod.coerce.number().int().min(1).default(1),
	pageSize: zod.coerce.number().int().min(1).max(100).default(20),
};

// User field validators
const username = zod
	.string()
	.trim()
	.min(
		fieldConstraints.username.minlength,
		`Username must be at least ${fieldConstraints.username.minlength} characters`
	)
	.max(
		fieldConstraints.username.maxlength,
		`Username must not exceed ${fieldConstraints.username.maxlength} characters`
	)
	.regex(
		commonPatterns.username,
		'Username must be alphanumeric or underscore'
	);

const email = zod
	.string()
	.trim()
	.email('Invalid email format')
	.max(
		fieldConstraints.email.maxlength,
		`Email must not exceed ${fieldConstraints.email.maxlength} characters`
	);

const password = zod
	.string()
	.min(
		fieldConstraints.password.minlength,
		`Password must be at least ${fieldConstraints.password.minlength} characters`
	);

// Role field validators
const roleName = zod
	.string()
	.trim()
	.min(
		fieldConstraints.roleName.minlength,
		`Role name must be at least ${fieldConstraints.roleName.minlength} characters`
	)
	.max(
		fieldConstraints.roleName.maxlength,
		`Role name must not exceed ${fieldConstraints.roleName.maxlength} characters`
	);

const roleDescription = zod
	.string()
	.trim()
	.min(
		fieldConstraints.roleDescription.minlength,
		`Description must be at least ${fieldConstraints.roleDescription.minlength} characters`
	)
	.max(
		fieldConstraints.roleDescription.maxlength,
		`Description must not exceed ${fieldConstraints.roleDescription.maxlength} characters`
	);

// Permission field validators
const permissionAction = zod
	.string()
	.trim()
	.min(
		fieldConstraints.permissionAction.minlength,
		`Action must be at least ${fieldConstraints.permissionAction.minlength} characters`
	)
	.max(
		fieldConstraints.permissionAction.maxlength,
		`Action must not exceed ${fieldConstraints.permissionAction.maxlength} characters`
	)
	.regex(
		commonPatterns.action,
		'Action must be lowercase alphanumeric or underscore'
	);

const permissionResource = zod
	.string()
	.trim()
	.min(
		fieldConstraints.permissionResource.minlength,
		`Resource must be at least ${fieldConstraints.permissionResource.minlength} characters`
	)
	.max(
		fieldConstraints.permissionResource.maxlength,
		`Resource must not exceed ${fieldConstraints.permissionResource.maxlength} characters`
	)
	.regex(
		commonPatterns.resource,
		'Resource must be lowercase alphanumeric or underscore'
	);

const permissionDescription = zod
	.string()
	.trim()
	.min(
		fieldConstraints.permissionDescription.minlength,
		`Description must be at least ${fieldConstraints.permissionDescription.minlength} characters`
	)
	.max(
		fieldConstraints.permissionDescription.maxlength,
		`Description must not exceed ${fieldConstraints.permissionDescription.maxlength} characters`
	);

/**
 * Parameter Schemas
 */
const idParamSchema = zod.object({
	id: objectId,
});

const optionalIdParamSchema = zod.object({
	id: objectId.optional(),
});

/**
 * Query Schemas
 */
const paginationQuerySchema = zod.object({
	page: pagination.page,
	pageSize: pagination.pageSize,
});

const userListQuerySchema = paginationQuerySchema.extend({
	search: zod.string().trim().optional(),
	role: zod.string().trim().optional(),
	emailVerified: zod.coerce.boolean().optional(),
	isActive: zod.coerce.boolean().optional(),
});

const includeInactiveQuerySchema = zod.object({
	includeInactive: zod
		.enum(['true', 'false'])
		.default('false')
		.transform((val) => val === 'true'),
});

/**
 * Body Schemas
 */
const userCreateBodySchema = zod.object({
	username,
	email,
	password,
	roles: objectIdArray.optional(),
});

const userUpdateBodySchema = zod
	.object({
		username: username.optional(),
		isActive: zod.boolean().optional(),
	})
	.strict();

const roleCreateBodySchema = zod.object({
	name: roleName,
	description: roleDescription,
	permissions: objectIdArray.optional(),
});

const roleUpdateBodySchema = zod
	.object({
		name: roleName.optional(),
		description: roleDescription.optional(),
		isActive: zod.boolean().optional(),
	})
	.strict();

const rolePermissionsBodySchema = objectIdArray;

const permissionByActionResourceSchema = zod
	.object({
		action: permissionAction,
		resource: permissionResource,
	})
	.strict();

const permissionCreateBodySchema = zod
	.object({
		action: permissionAction,
		resource: permissionResource,
		description: permissionDescription,
	})
	.strict();

const permissionUpdateBodySchema = zod
	.object({
		action: permissionAction.optional(),
		resource: permissionResource.optional(),
		description: permissionDescription.optional(),
		isActive: zod.boolean().optional(),
	})
	.strict();

const permissionBulkCreateBodySchema = zod.object({
	permissions: zod
		.array(permissionCreateBodySchema)
		.min(1, 'Must provide at least one permission'),
});

const roleIdArrayBodySchema = zod.object({
	roleIds: objectIdArray,
});

const permissionIdArrayBodySchema = zod.object({
	permissionIds: objectIdArray,
});

/**
 * Validation error formatter
 * Converts Zod errors to a user-friendly format
 * @param {ZodError} error - Zod validation error
 * @returns {string} Formatted error message
 */
function formatValidationError(error) {
	if (error.issues && error.issues.length > 0) {
		const firstIssue = error.issues[0];
		const path =
			firstIssue.path.length > 0 ? `${firstIssue.path.join('.')}: ` : '';
		return `${path}${firstIssue.message}`;
	}
	return 'Validation error';
}

/**
 * Safe parse with error handling
 * @param {ZodSchema} schema - Zod schema to validate against
 * @param {*} data - Data to validate
 * @returns {Object} { success: boolean, data?: any, error?: string }
 */
function safeValidate(schema, data) {
	const result = schema.safeParse(data);
	if (!result.success) {
		return {
			success: false,
			error: formatValidationError(result.error),
		};
	}
	return {
		success: true,
		data: result.data,
	};
}

module.exports = {
	// Basic validators
	zod,
	objectId,
	objectIdArray,

	// Pagination
	pagination,
	paginationQuerySchema,

	// User validators
	username,
	email,
	password,
	userListQuerySchema,
	userCreateBodySchema,
	userUpdateBodySchema,
	roleIdArrayBodySchema,

	// Role validators
	roleName,
	roleDescription,
	roleCreateBodySchema,
	roleUpdateBodySchema,
	rolePermissionsBodySchema,

	// Permission validators
	permissionAction,
	permissionResource,
	permissionDescription,
	permissionCreateBodySchema,
	permissionUpdateBodySchema,
	permissionBulkCreateBodySchema,
	permissionIdArrayBodySchema,
	permissionByActionResourceSchema,

	// Parameter schemas
	idParamSchema,
	optionalIdParamSchema,
	includeInactiveQuerySchema,

	// Utilities
	formatValidationError,
	safeValidate,
};
