var morgan = require('morgan');
var express = require('express');
var errorHandlerMiddleware = require('./src/middlewares/error-handler.middleware.js');
var routes = require('./src/routes');
var app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(routes.usersRouter);
app.use(routes.rolesRouter);
app.use(routes.permissionsRouter);

app.get('/', function getHome(req, res) {
	res.status(200).end();
});

app.use(errorHandlerMiddleware);

app.use((req, res) => {
	res.status(404).end();
});

module.exports = app;
