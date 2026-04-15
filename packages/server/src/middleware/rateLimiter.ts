import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';

// General API rate limit: 100 requests per 15 minutes per IP.
export const apiLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// Stricter limit for auth routes: 20 requests per 15 minutes per IP.
export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication requests, please try again later.' },
});

// Spotify API proxy routes: 200 requests per 15 minutes per IP.
// Higher limit since the client polls for playback state.
export const spotifyLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
