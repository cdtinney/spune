import { Router, type IRouter } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const router: IRouter = Router();

let commitSha = 'unknown';
try {
  commitSha = readFileSync(resolve(__dirname, '../../COMMIT_SHA'), 'utf-8').trim();
} catch {
  // Not available outside Docker builds — default to 'unknown'
}

const startedAt = new Date().toISOString();

router.get('/', (_req, res) => {
  res.json({
    version: commitSha,
    uptime: process.uptime(),
    startedAt,
  });
});

export default router;
