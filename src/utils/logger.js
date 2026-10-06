const path = require('path');
const { createLogger, format, transports } = require('winston');

const logDir = path.join(process.cwd(), 'logs');

const logger = createLogger({
  level: 'http', // captures error, warn, info, http
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'app.log') }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }));
}

module.exports = logger;