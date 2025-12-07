/**
 * DTO Mapping Utilities
 * Common functions for converting MongoDB documents to Data Transfer Objects
 */

/**
 * Extract ID from MongoDB object or string
 * Handles both populated objects (_id field) and ID strings
 */
const extractId = (item) => {
	if (!item) return null;
	if (typeof item === 'string') return item;
	return (item._id || item.id).toString();
};

/**
 * Map User to DTO
 * Extracts role IDs from populated role objects if needed
 */
const mapUserToDTO = (user) => {
	if (!user) {
		return null;
	}

	let mappedRoles = [];
	if (Array.isArray(user.roles)) {
		mappedRoles = user.roles.map(mapRoleToDTO);
	}

	return {
		id: user._id,
		username: user.username,
		email: user.email,
		emailVerified: user.emailVerified,
		isActive: user.isActive,
		roles: mappedRoles,
		lastLogin: user.lastLogin,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
};

/**
 * Map Permission to DTO
 * Simple mapping for permission documents
 */
const mapPermissionToDTO = (perm) => {
	if (!perm) {
		return null;
	}
	return {
		id: perm._id,
		action: perm.action,
		resource: perm.resource,
		description: perm.description,
		isActive: perm.isActive,
		createdAt: perm.createdAt,
		updatedAt: perm.updatedAt,
	};
};

/**
 * Map Role to DTO
 * Extracts permission IDs from populated permission objects if needed
 */
const mapRoleToDTO = (role) => {
	if (!role) {
		return null;
	}

	return {
		id: role._id,
		name: role.name,
		description: role.description,
		isActive: role.isActive,
		createdAt: role.createdAt,
		updatedAt: role.updatedAt,
	};
};

module.exports = {
	extractId,
	mapUserToDTO,
	mapRoleToDTO,
	mapPermissionToDTO,
};
