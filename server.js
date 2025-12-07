require('dotenv').config();

var app = require('./app.js');
var Logger = require('./src/utilities/logger.utility.js');

const PORT = process.env.PORT || 3000;

app.listen(PORT, function serverListenCallback(err) {
	if (err) {
		Logger.error(err);
		return;
	}
	Logger.info(`server is running on http://localhost:${PORT}`);
});
