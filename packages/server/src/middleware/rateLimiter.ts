import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';

const isProduction = process.env.NODE_ENV === 'production';
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const passthrough: RequestHandler = (_req, _res, next) => next();

function createLimiter(max: number, message: string): RequestHandler {
  return isProduction
    ? rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message,
      })
    : passthrough;
}

export const apiLimiter: RequestHandler = createLimiter(
  1000,
  'Too many requests, please try again later.',
);
export const authLimiter: RequestHandler = createLimiter(
  50,
  'Too many authentication requests, please try again later.',
);
export const spotifyLimiter: RequestHandler = createLimiter(
  500,
  'Too many requests, please try again later.',
);
