var Logger = require('./src/utilities/logger.utility.js');
var errorHandlerMiddleware = require('./src/middleware/error-handler.middleware.js');
var path = require('path');
var ejs = require('ejs');
var express = require('express');
var ApiError = require('./src/utilities/api-error.utility.js');
var app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'src', 'views'));

app.get('/', function getHome(req, res) {
	res.status(200).render('index');
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
	res.status(404).render('error/404');
});

module.exports = app;
