import { Router, type IRouter, type Request, type Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

import logger, { ERROR_LOG_FILE } from '../logger/logger';
import { requireAdmin } from '../auth/admin';
import {
  listUsers,
  listActiveSessions,
  getKeepaliveStatus,
} from '../database/queries/adminQueries';

const router: IRouter = Router();
router.use(requireAdmin);

const MAX_LOG_LINES = 200;
const DEFAULT_LOG_LINES = 50;

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await listUsers();
    res.json({ users });
  } catch (error) {
    logger.error('[admin] Failed to list users', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.get('/sessions', async (_req: Request, res: Response) => {
  try {
    const sessions = await listActiveSessions();
    res.json({ sessions });
  } catch (error) {
    logger.error('[admin] Failed to list sessions', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

router.get('/keepalive', async (_req: Request, res: Response) => {
  try {
    const status = await getKeepaliveStatus();
    res.json(status);
  } catch (error) {
    logger.error('[admin] Failed to get keepalive status', error);
    res.status(500).json({ error: 'Failed to get keepalive status' });
  }
});

interface LogEntry {
  raw: string;
  parsed?: Record<string, unknown>;
}

function parseLogLine(line: string): LogEntry {
  try {
    const parsed = JSON.parse(line) as Record<string, unknown>;
    return { raw: line, parsed };
  } catch {
    return { raw: line };
  }
}

function clampLimit(raw: unknown): number {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LOG_LINES;
  return Math.min(n, MAX_LOG_LINES);
}

router.get('/logs', async (req: Request, res: Response) => {
  const limit = clampLimit(req.query.limit);
  const filePath = path.resolve(ERROR_LOG_FILE);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content
      .split('\n')
      .filter((line) => line.length > 0)
      .slice(-limit)
      .map(parseLogLine);
    res.json({ file: filePath, limit, entries: lines });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      res.json({ file: filePath, limit, entries: [], note: 'Log file not found' });
      return;
    }
    logger.error('[admin] Failed to read log file', error);
    res.status(500).json({ error: 'Failed to read log file' });
  }
});

export default router;
