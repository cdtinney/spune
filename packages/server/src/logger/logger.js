const {
  createLogger,
  format,
  transports,
} = require('winston');

const appName = 'spune';

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
    service: `${appName}-server`,
  },
  transports: [
    new transports.File({
      filename: `${appName}-error.log`,
      level: 'error',
    }),
    new transports.File({
      filename: `${appName}-combined.log`,
    }),
  ],
});

const {
  NODE_ENV,
  DISABLE_LOGGING,
} = process.env;

// Enable logs if and only if we are in a non-production environment
// and logging is not explicitly disabled.
if (NODE_ENV !== 'production' && DISABLE_LOGGING !== 'true') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }));
}

module.exports = logger;
