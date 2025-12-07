// Environment Configuration Handler
// Centralizes and validates all environment variables with sensible defaults
// Ensures type safety and provides clear error messages for missing critical vars

const getEnvironmentConfig = () => {
	// Validate critical environment variables
	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI environment variable is required');
	}

	return {
		// Application Configuration
		app: {
			port: parseInt(process.env.PORT, 10) || 3000,
			env: process.env.NODE_ENV || 'development',
			isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
			isProduction: process.env.NODE_ENV === 'production',
			isTest: process.env.NODE_ENV === 'test',
		},

		// Database Configuration
		database: {
			mongoUri: process.env.MONGO_URI,
			mongoPoolSize: parseInt(process.env.MONGO_POOL_SIZE, 10) || 10,
			mongoMaxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE, 10) || 50,
			mongoServerSelectionTimeoutMS:
				parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT, 10) || 5000,
			mongoConnectTimeoutMS:
				parseInt(process.env.MONGO_CONNECT_TIMEOUT, 10) || 10000,
			mongoSocketTimeoutMS:
				parseInt(process.env.MONGO_SOCKET_TIMEOUT, 10) || 45000,
			mongoRetryWrites: process.env.MONGO_RETRY_WRITES !== 'false',
		},

		// API Documentation
		api: {
			docsUrl: process.env.API_DOCS_URL || 'http://localhost:3000/api',
			title: process.env.API_TITLE || 'Role Management API',
			version: process.env.API_VERSION || '1.0.0',
			description:
				process.env.API_DESCRIPTION ||
				'API to manage roles, users, and permissions',
		},

		// Logging Configuration
		logging: {
			morganFormat: process.env.MORGAN_FORMAT || 'dev',
			level: process.env.LOG_LEVEL || 'info',
		},
	};
};

// Singleton instance to avoid re-validation
let configInstance = null;

const getConfig = () => {
	if (!configInstance) {
		configInstance = getEnvironmentConfig();
	}
	return configInstance;
};

module.exports = {
	getConfig,
	getEnvironmentConfig,
};
