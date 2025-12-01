const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
	definition: {
		openapi: '3.0.3',
		info: {
			title: 'Role Management API',
			version: '1.0.0',
			description: 'API to manage roles, users, and permissions',
		},
		servers: [
			{
				url: 'http://localhost:4000/admin',
			},
		],
	},
	apis: [
		path.join(__dirname, '../../routes/**/*.js'),
		path.join(__dirname, '../../controllers/**/*.js'),
	],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
