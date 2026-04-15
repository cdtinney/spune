import { Router, type IRouter } from 'express';
import authRoutes from './auth';
import spotifyRoutes from './spotify';

const router: IRouter = Router();
router.use('/auth', authRoutes);
router.use('/spotify', spotifyRoutes);

export default router;
