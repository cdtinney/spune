import { Router, type IRouter } from 'express';

const router: IRouter = Router();

const startedAt = new Date().toISOString();

router.get('/', (_req, res) => {
  res.json({
    version: process.env.COMMIT_SHA || 'unknown',
    uptime: process.uptime(),
    startedAt,
  });
});

export default router;
