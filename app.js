var Logger = require('./src/utilities/logger.utility.js');
var errorHandlerMiddleware = require('./src/middlewares/error-handler.middleware.js');
var path = require('path');
var express = require('express');
var ApiError = require('./src/utilities/api-error.utility.js');
var app = express();

app.get('/', function getHome(req, res) {
	res.status(200).end();
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
	res.status(404).end();
});

module.exports = app;
