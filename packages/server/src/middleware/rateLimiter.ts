import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
// 15 minutes
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const passthrough: RequestHandler = (_req, _res, next) => next();

function createLimiter(max: number): RequestHandler {
  return isProduction
    ? rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: 'Too many requests, please try again later.',
      })
    : passthrough;
}

export const apiLimiter: RequestHandler = createLimiter(1000);
export const authLimiter: RequestHandler = createLimiter(50);
export const spotifyLimiter: RequestHandler = createLimiter(500);
export const statusLimiter: RequestHandler = createLimiter(30);
