const { getConfig } = require('./environment');
const { createConnection, getConnection } = require('./mongoose');
const { setupSwagger, createSwaggerConfig } = require('./swagger');

/**
 * Central Configuration Module
 * Exports all configuration utilities for easy access throughout the application
 */

// Get merged config
const config = getConfig();

// Initialize MongoDB connection
createConnection(config.database);

module.exports = {
	// Environment config
	config,
	getConfig,

	// MongoDB
	createConnection,
	getConnection,

	// Swagger
	setupSwagger,
	createSwaggerConfig,
};
