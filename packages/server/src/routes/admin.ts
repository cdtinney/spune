import { Router, type IRouter, type Request, type Response } from 'express';

import logger from '../logger/logger';
import { requireRole } from '../auth/role';
import { listUsers, listActiveSessions } from '../database/queries/adminQueries';

const router: IRouter = Router();
router.use(requireRole('admin'));

router.get('/users', async (_req: Request, res: Response) => {
  try {
    res.json({ users: await listUsers() });
  } catch (error) {
    logger.error('[admin] list users failed', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    res.json({ sessions: await listActiveSessions() });
  } catch (error) {
    logger.error('[admin] list sessions failed', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

export default router;
