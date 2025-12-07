const mongoose = require('mongoose');
const Logger = require('../../utilities/logger.utility');

/**
 * MongoDB Connection Configuration
 * Creates and manages a dedicated MongoDB connection with proper error handling,
 * connection pooling, and event monitoring
 */

let mongoConnection = null;

const createConnection = (config) => {
	const {
		mongoUri,
		mongoPoolSize,
		mongoMaxPoolSize,
		mongoServerSelectionTimeoutMS,
		mongoConnectTimeoutMS,
		mongoSocketTimeoutMS,
		mongoRetryWrites,
	} = config;

	const mongooseOptions = {
		maxPoolSize: mongoMaxPoolSize,
		minPoolSize: mongoPoolSize,
		serverSelectionTimeoutMS: mongoServerSelectionTimeoutMS,
		connectTimeoutMS: mongoConnectTimeoutMS,
		socketTimeoutMS: mongoSocketTimeoutMS,
		retryWrites: mongoRetryWrites,
	};

	try {
		mongoConnection = mongoose.createConnection(mongoUri, mongooseOptions);

		// Connection event handlers
		mongoConnection.on('connected', () => {
			Logger.info('MongoDB connected successfully');
		});

		mongoConnection.on('error', (err) => {
			Logger.error(`MongoDB connection error: ${err.message}`);
		});

		mongoConnection.on('disconnected', () => {
			Logger.warn('MongoDB disconnected');
		});

		mongoConnection.on('reconnected', () => {
			Logger.info('MongoDB reconnected');
		});

		return mongoConnection;
	} catch (error) {
		Logger.error(`Failed to create MongoDB connection: ${error.message}`);
		throw error;
	}
};

const getConnection = () => {
	if (!mongoConnection) {
		throw new Error('MongoDB connection has not been established yet.');
	}
	return mongoConnection;
};

module.exports = {
	createConnection,
	getConnection,
};
