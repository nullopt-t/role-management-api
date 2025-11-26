var path = require('path');
var morgan = require('morgan');
var express = require('express');
var errorHandlerMiddleware = require('./src/middlewares/error-handler.middleware.js');
var ApiError = require('./src/utilities/api-error.utility.js');
var Logger = require('./src/utilities/logger.utility.js');
var routes = require('./src/routes');
var app = express();

app.use(morgan('dev'));

app.use('/users', routes.usersRouter);
app.use('/roles', routes.rolesRouter);

app.get('/', function getHome(req, res) {
	res.status(200).end();
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
	res.status(404).end();
});

module.exports = app;
