var Logger = require('../utilities/logger.utility.js');
var useragent = require('useragent');

module.exports = function (err, req, res, next) {
	if (!err || (!err.message && !(err instanceof Error))) {
		return next();
	}

	let statusCode =
		Number(err.status) ||
		Number(err.statusCode) ||
		(err.name === 'ZodError' ? 400 : 500);

	const responseBody = {
		success: false,
		message: err.message || 'Internal Server Error',
	};

	let logMessage = responseBody.message;

	if (err.name === 'ZodError' && Array.isArray(err.issues)) {
		responseBody.message =
			'Validation failed. Check the details for specific errors.';

		responseBody.details = err.issues.map((issue) => ({
			field: issue.path.join('.'),
			code: issue.code,
			message: issue.message,
		}));

		const issueSummary = responseBody.details
			.map((d) => `${d.field}: ${d.message}`)
			.slice(0, 3)
			.join('; ');

		logMessage = `Zod Validation Error (${statusCode}) on ${req.originalUrl}: ${issueSummary}`;
	}

	const client =
		useragent.parse(req.headers['user-agent'] || '').toString() || 'unknown';

	Logger.error({
		code: statusCode,
		message: logMessage,
		path: req.originalUrl,
		method: req.method,
		client,
		// stack: err.stack,
	});

	return res.status(statusCode).json(responseBody);
};
