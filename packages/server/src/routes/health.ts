import { Router, type IRouter } from 'express';
import { pool } from '../database/db';
import logger from '../logger';

const router: IRouter = Router();

const DB_CHECK_TIMEOUT_MS = 2000;

async function checkDatabase(): Promise<boolean> {
  let timeoutId: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('db check timed out')), DB_CHECK_TIMEOUT_MS);
  });
  try {
    await Promise.race([pool.query('SELECT 1'), timeout]);
    return true;
  } catch (err) {
    logger.warn('[health] DB check failed', { error: err instanceof Error ? err.message : err });
    return false;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

router.get('/', async (_req, res) => {
  const dbOk = await checkDatabase();
  res.status(dbOk ? 200 : 503).json({ status: dbOk ? 'ok' : 'error' });
});

export default router;
