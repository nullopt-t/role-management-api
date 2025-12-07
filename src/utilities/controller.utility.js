/**
 * Send successful JSON response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} JSON response
 */
function sendSuccess(res, data, statusCode = 200) {
	return res.status(statusCode).json({
		success: true,
		data,
	});
}

/**
 * Send error JSON response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @returns {Object} JSON response
 */
function sendError(res, message, statusCode = 400) {
	return res.status(statusCode).json({
		success: false,
		message,
	});
}

/**
 * Send paginated JSON response
 * @param {Object} res - Express response object
 * @param {Object} result - Pagination result object
 * @returns {Object} JSON response
 */
function sendPaginated(res, result) {
	return res.status(200).json({
		success: true,
		data: result.items,
		pagination: {
			page: result.page,
			pageSize: result.pageSize,
			total: result.total,
			totalPages: result.totalPages,
			hasNextPage: result.hasNextPage,
			hasPrevPage: result.hasPrevPage,
		},
	});
}


/**
 * Check if resource exists, return error if not
 * @param {*} resource - The resource to check
 * @param {Object} res - Express response object
 * @param {string} resourceName - Name of the resource (e.g., 'User', 'Role')
 * @returns {boolean} True if resource exists, false if error was sent
 */
function checkResourceExists(resource, res, resourceName = 'Resource') {
	if (!resource) {
		sendError(res, `${resourceName} not found`, 404);
		return false;
	}
	return true;
}

/**
 * Async wrapper for controller methods to catch errors
 * @param {Function} fn - Async controller function
 * @returns {Function} Express middleware function
 */
function asyncHandler(fn) {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

module.exports = {
	sendSuccess,
	sendError,
	sendPaginated,
	checkResourceExists,
	asyncHandler,
};
