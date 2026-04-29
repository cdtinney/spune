import { Router, type IRouter, type Request, type Response, type RequestHandler } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

import logger, { ERROR_LOG_FILE } from '../logger/logger';
import { requireRole } from '../auth/role';
import {
  listUsers,
  listActiveSessions,
  getKeepaliveStatus,
} from '../database/queries/adminQueries';

const router: IRouter = Router();
router.use(requireRole('admin'));

const MAX_LOG_LINES = 200;
const DEFAULT_LOG_LINES = 50;

function safeAdminHandler(
  name: string,
  handler: (req: Request, res: Response) => Promise<void>,
): RequestHandler {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      logger.error(`[admin] ${name} failed`, error);
      res.status(500).json({ error: `Failed to ${name}` });
    }
  };
}

router.get(
  '/users',
  safeAdminHandler('list users', async (_req, res) => {
    res.json({ users: await listUsers() });
  }),
);

router.get(
  '/sessions',
  safeAdminHandler('list sessions', async (_req, res) => {
    res.json({ sessions: await listActiveSessions() });
  }),
);

router.get(
  '/keepalive',
  safeAdminHandler('get keepalive status', async (_req, res) => {
    res.json(await getKeepaliveStatus());
  }),
);

interface LogEntry {
  raw: string;
  parsed?: Record<string, unknown>;
}

function parseLogLine(line: string): LogEntry {
  try {
    return { raw: line, parsed: JSON.parse(line) as Record<string, unknown> };
  } catch {
    return { raw: line };
  }
}

function clampLimit(raw: unknown): number {
  const n = typeof raw === 'string' ? parseInt(raw, 10) : NaN;
  if (!Number.isFinite(n) || n <= 0) return DEFAULT_LOG_LINES;
  return Math.min(n, MAX_LOG_LINES);
}

router.get(
  '/logs',
  safeAdminHandler('read log file', async (req, res) => {
    const limit = clampLimit(req.query.limit);
    const filePath = path.resolve(ERROR_LOG_FILE);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const entries = content
        .split('\n')
        .filter((line) => line.length > 0)
        .slice(-limit)
        .map(parseLogLine);
      res.json({ file: ERROR_LOG_FILE, limit, entries });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      res.json({ file: ERROR_LOG_FILE, limit, entries: [], note: 'Log file not found' });
    }
  }),
);

export default router;
