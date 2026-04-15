import { Router, type IRouter } from 'express';
import { apiLimiter, authLimiter, spotifyLimiter } from '../middleware/rateLimiter';
import authRoutes from './auth';
import spotifyRoutes from './spotify';
import sseRoutes from './sse';

const router: IRouter = Router();

// Apply general rate limit to all API routes.
router.use(apiLimiter);

// Apply stricter limits per route group.
router.use('/auth', authLimiter, authRoutes);
router.use('/spotify', spotifyLimiter, spotifyRoutes);
router.use('/sse', sseRoutes); // No rate limiting — long-lived connections

export default router;
