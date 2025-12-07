var morgan = require('morgan');
var express = require('express');
var routes = require('./src/routes');
var errorHandlerMiddleware = require('./src/middlewares/error-handler.middleware.js');
var { setupSwagger, config } = require('./src/configs');

const app = express();

app.use(morgan(config.logging.morganFormat));
app.use(express.json());

// Setup Swagger documentation
setupSwagger(app, config.api);

app.use('/api/admin', routes.adminUsersRouter);
app.use('/api/admin', routes.adminRolesRouter);
app.use('/api/admin', routes.adminPermissionsRouter);
app.use('/api/', routes.publicRouter);

app.get('/', function getHome(req, res) {
	res.status(200).end();
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
	res.status(404).end();
});

module.exports = app;
