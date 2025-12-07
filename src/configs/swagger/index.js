const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const Logger = require('../../utilities/logger.utility');

/**
 * Swagger/OpenAPI Configuration
 * Sets up API documentation with dynamic configuration based on environment
 */

const createSwaggerConfig = (apiConfig) => {
	const {
		title = 'API',
		version = '1.0.0',
		description = 'API Documentation',
		docsUrl = 'http://localhost:3000/api',
	} = apiConfig;

	return {
		definition: {
			openapi: '3.0.3',
			info: {
				title,
				version,
				description,
				contact: {
					name: 'API Support',
				},
				license: {
					name: 'MIT',
				},
			},
			servers: [
				{
					url: docsUrl,
					description: 'API Server',
				},
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
					},
				},
			},
		},
		apis: [
			path.join(__dirname, '../../routes/**/*.js'),
			path.join(__dirname, '../../controllers/**/*.js'),
		],
	};
};

/**
 * Setup Swagger UI on the Express app
 * @param {Object} app - Express application instance
 * @param {Object} config - Configuration object with api settings
 */
const setupSwagger = (app, config) => {
	try {
		const swaggerOptions = createSwaggerConfig(config);
		const specs = swaggerJsdoc(swaggerOptions);

		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

		Logger.info('Swagger documentation configured at /api-docs');
	} catch (error) {
		Logger.error(`Failed to setup Swagger documentation: ${error.message}`);
		throw error;
	}
};

module.exports = {
	setupSwagger,
	createSwaggerConfig,
};
