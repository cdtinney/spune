import type { RequestHandler } from 'express';
import logger from '../logger';

const SKIP_PATHS = new Set(['/api/health']);

const httpLogger: RequestHandler = (req, res, next) => {
  if (SKIP_PATHS.has(req.path)) {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    logger.info({
      message: 'http_request',
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
    });
  });

  next();
};

export default httpLogger;
