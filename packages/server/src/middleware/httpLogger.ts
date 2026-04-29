import type { RequestHandler } from 'express';
import logger from '../logger';

// Skip uptime polls (noise) and SSE streams (durationMs would measure stream lifetime, not request work).
function shouldSkip(path: string): boolean {
  return path === '/api/health' || path.startsWith('/api/sse/');
}

const httpLogger: RequestHandler = (req, res, next) => {
  if (shouldSkip(req.path)) {
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
