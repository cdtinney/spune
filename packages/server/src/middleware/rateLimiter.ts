import rateLimit from 'express-rate-limit';
import type { RequestHandler } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const passthrough: RequestHandler = (_req, _res, next) => next();

export const apiLimiter: RequestHandler = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
    })
  : passthrough;

export const authLimiter: RequestHandler = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 50,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many authentication requests, please try again later.',
    })
  : passthrough;

export const spotifyLimiter: RequestHandler = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 500,
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests, please try again later.',
    })
  : passthrough;
