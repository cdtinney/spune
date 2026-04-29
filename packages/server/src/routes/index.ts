import { Router, type IRouter } from 'express';
import { apiLimiter, authLimiter, spotifyLimiter, statusLimiter } from '../middleware/rateLimiter';
import authRoutes from './auth';
import healthRoutes from './health';
import spotifyRoutes from './spotify';
import sseRoutes from './sse';
import statusRoutes from './status';

const router: IRouter = Router();

// Health check is mounted before the rate limiter so uptime monitors can poll freely.
router.use('/health', healthRoutes);

router.use(apiLimiter);

// Apply stricter limits per route group.
router.use('/auth', authLimiter, authRoutes);
router.use('/spotify', spotifyLimiter, spotifyRoutes);
router.use('/sse', sseRoutes); // No rate limiting — long-lived connections
router.use('/status', statusLimiter, statusRoutes);

export default router;
