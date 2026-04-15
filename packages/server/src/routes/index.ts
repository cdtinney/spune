import { Router } from 'express';
import authRoutes from './auth';
import spotifyRoutes from './spotify';

const router = Router();
router.use('/auth', authRoutes);
router.use('/spotify', spotifyRoutes);

export default router;
