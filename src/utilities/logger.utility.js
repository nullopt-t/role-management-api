const winston = require('winston');
const path = require('path');
const fs = require('fs');
const typesUtility = require('./types.utility');
require('winston-daily-rotate-file');

class Logger {
	constructor(options = {}) {
		this.env = process.env.NODE_ENV || 'development';
		this.logDir = options.logDir || path.join(process.cwd(), 'logs');

		// check the existing of the log folder
		if (!fs.existsSync(this.logDir)) {
			fs.mkdirSync(this.logDir, { recursive: true });
		}

		this.levels = {
			error: 0,
			warn: 1,
			info: 2,
			http: 3,
			debug: 4,
		};

		const colors = {
			error: 'red',
			warn: 'yellow',
			info: 'green',
			http: 'cyan',
			debug: 'magenta',
		};

		winston.addColors(colors);

		const transports = [
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.colorize(),
					winston.format.timestamp(),
					winston.format.errors(),
					winston.format.printf((info) => this.consoleFormat(info))
				),
			}),
		];

		const levelFilter = (level) => {
			return winston.format((info) => (info.level === level ? info : false))();
		};

		Object.keys(this.levels).forEach((level) => {
			transports.push(
				new winston.transports.DailyRotateFile({
					level,
					filename: path.join(this.logDir, `${level}-%DATE%.log`),
					datePattern: 'YYYY-MM-DD',
					zippedArchive: true,
					maxFiles: '14d',
					maxSize: '20m',
					format: winston.format.combine(
						levelFilter(level),
						winston.format.timestamp(),
						winston.format.errors({ stack: true }),
						winston.format.json()
					),
				})
			);
		});

		this.logger = winston.createLogger({
			levels: this.levels,
			transports: transports,
		});
	}

	consoleFormat(info) {
		const { timestamp, level, message, stack, ...meta } = info;

		// safer readable message
		const msg = typesUtility.isObject(message)
			? JSON.stringify(message, null, 2)
			: message;

		let output = `[${timestamp}] ${level}: ${msg}`;

		if (stack) {
			output += `\nSTACK:\n${stack}`;
		}

		if (Object.keys(meta).length) {
			output += `\nMETA:\n${JSON.stringify(meta, null, 2)}`;
		}

		return output;
	}

	// basic logging methods
	info(msg, meta = {}) {
		this.logger.info(msg, meta);
	}

	warn(msg, meta = {}) {
		this.logger.warn(msg, meta);
	}

	error(msg, meta = {}) {
		this.logger.error(msg, meta);
	}

	http(msg, meta = {}) {
		this.logger.http(msg, meta);
	}

	debug(msg, meta = {}) {
		this.logger.debug(msg, meta);
	}

	// timing helper
	time(label = 'default') {
		const start = Date.now();
		return () => {
			const duration = Date.now() - start;
			this.info(`${label} took ${duration}ms`, { duration });
		};
	}
}

module.exports = new Logger();
