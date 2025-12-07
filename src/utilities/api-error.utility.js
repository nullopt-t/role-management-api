class ApiError extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = 'ApiError';
		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = ApiError;
