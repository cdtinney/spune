import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import logger from '../../logger';
import httpLogger from '../httpLogger';

function buildApp() {
  const app = express();
  app.use(httpLogger);
  app.get('/api/spotify/me/player', (_req, res) => res.json({ ok: true }));
  app.get('/api/health', (_req, res) => res.json({ ok: true }));
  app.get('/boom', (_req, _res, next) => next(new Error('boom')));
  return app;
}

describe('httpLogger middleware', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(logger, 'info').mockImplementation(() => logger);
  });

  it('logs one entry with method, url, status, durationMs', async () => {
    await request(buildApp()).get('/api/spotify/me/player');

    expect(logger.info).toHaveBeenCalledTimes(1);
    const [meta] = vi.mocked(logger.info).mock.calls[0] as [Record<string, unknown>];
    expect(meta).toMatchObject({
      message: 'http_request',
      method: 'GET',
      url: '/api/spotify/me/player',
      status: 200,
    });
    expect(typeof meta.durationMs).toBe('number');
  });

  it('skips /api/health', async () => {
    await request(buildApp()).get('/api/health');
    expect(logger.info).not.toHaveBeenCalled();
  });

  it('still logs error responses with the error status code', async () => {
    await request(buildApp()).get('/boom');
    expect(logger.info).toHaveBeenCalledTimes(1);
    const [meta] = vi.mocked(logger.info).mock.calls[0] as [Record<string, unknown>];
    expect(meta.status).toBe(500);
  });
});
