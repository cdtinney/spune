import { createLogger, format, transports } from 'winston';
import { getRequestId } from '../middleware/requestContext';

const requestIdFormat = format((info) => {
  const requestId = getRequestId();
  if (requestId) info.requestId = requestId;
  return info;
});

export const ERROR_LOG_FILE = 'spune-error.log';
export const COMBINED_LOG_FILE = 'spune-combined.log';

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
    requestIdFormat(),
    format.json(),
  ),
  defaultMeta: {
    service: 'spune-server',
  },
  transports: [
    new transports.File({
      filename: ERROR_LOG_FILE,
      level: 'error',
    }),
    new transports.File({
      filename: COMBINED_LOG_FILE,
    }),
  ],
});

// Logs to console in non-prod environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;
