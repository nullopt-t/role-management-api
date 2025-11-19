var Logger = require('../utilities/logger.utility.js');
var useragent = require('useragent');

module.exports = function (err, req, res, next) {
	if (!(err instanceof Error)) {
		return next();
	}

	const statusCode = err.code || 500;
	const statusMessage = err.message || 'Internal Server Error';
	const client =
		useragent.parse(req.headers['user-agent']).toString() || 'unknown';

	Logger.error({
		code: statusCode,
		message: statusMessage,
		// stack: err.stack, // only if the log will be saved in database
		path: req.originalUrl,
		method: req.method,
		client: client,
	});

	return res.status(statusCode).json({
		success: false,
		message: statusMessage,
	});
};
