import { Router, type IRouter } from 'express';
import { apiLimiter, authLimiter, spotifyLimiter, statusLimiter } from '../middleware/rateLimiter';
import authRoutes from './auth';
import healthRoutes from './health';
import spotifyRoutes from './spotify';
import sseRoutes from './sse';
import statusRoutes from './status';

const router: IRouter = Router();

// Mount uptime/health checks before any rate limiter so external monitors can poll freely.
router.use('/health', healthRoutes);

// Apply general rate limit to all remaining API routes.
router.use(apiLimiter);

// Apply stricter limits per route group.
router.use('/auth', authLimiter, authRoutes);
router.use('/spotify', spotifyLimiter, spotifyRoutes);
router.use('/sse', sseRoutes); // No rate limiting — long-lived connections
router.use('/status', statusLimiter, statusRoutes);

export default router;
