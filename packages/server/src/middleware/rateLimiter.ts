import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';

const isProduction = process.env.NODE_ENV === 'production';

// General API rate limit: 1000 requests per 15 minutes per IP.
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 1000 : 0, // 0 = disabled in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

// Auth routes: 50 requests per 15 minutes per IP.
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 50 : 0,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication requests, please try again later.',
});

// Spotify API proxy routes: 500 requests per 15 minutes per IP.
// Higher limit since the client polls every 3 seconds (~300 requests/15min).
export const spotifyLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProduction ? 500 : 0,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});
