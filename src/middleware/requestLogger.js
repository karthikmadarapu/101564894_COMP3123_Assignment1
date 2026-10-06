const morgan = require('morgan');
const logger = require('../utils/logger');

module.exports =  morgan(':method :url :status :response-time ms', {
  stream: { write: (msg) => logger.http(msg.trim()) },
});