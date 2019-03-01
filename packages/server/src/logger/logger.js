const {
  createLogger,
  format,
  transports,
} = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({
      stack: true,
    }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: {
    service: 'spune-server',
  },
  transports: [
    new transports.File({
      filename: 'spune-error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'spune-combined.log',
    }),
  ],
});

// Logs to console in non-prod environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }));
}

module.exports = logger;
