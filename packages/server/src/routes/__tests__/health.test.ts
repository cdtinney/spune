import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { pool } from '../../database/db';
import healthRoutes from '../health';

function buildApp() {
  const app = express();
  app.use('/api/health', healthRoutes);
  return app;
}

describe('/api/health', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 200 with status ok when the DB responds', async () => {
    vi.spyOn(pool, 'query').mockResolvedValue({ rows: [] } as never);

    const res = await request(buildApp()).get('/api/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'ok' });
  });

  it('returns 503 when the DB query fails', async () => {
    vi.spyOn(pool, 'query').mockRejectedValue(new Error('connection refused'));

    const res = await request(buildApp()).get('/api/health');

    expect(res.statusCode).toBe(503);
    expect(res.body).toEqual({ status: 'error', db: 'down' });
  });
});
