import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import requestContext, { getRequestId } from '../requestContext';

function buildApp() {
  const app = express();
  app.use(requestContext);
  app.get('/echo', (_req, res) => {
    res.json({ requestId: getRequestId() });
  });
  return app;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe('requestContext middleware', () => {
  it('returns undefined from getRequestId() outside an active request', () => {
    expect(getRequestId()).toBeUndefined();
  });

  it('generates a UUID when no X-Request-Id header is present', async () => {
    const res = await request(buildApp()).get('/echo');
    expect(res.statusCode).toBe(200);
    expect(res.body.requestId).toMatch(UUID_RE);
    expect(res.headers['x-request-id']).toBe(res.body.requestId);
  });

  it('preserves a valid inbound X-Request-Id header', async () => {
    const inbound = 'trace-abc_123.45:67';
    const res = await request(buildApp()).get('/echo').set('X-Request-Id', inbound);
    expect(res.body.requestId).toBe(inbound);
    expect(res.headers['x-request-id']).toBe(inbound);
  });

  it('replaces an inbound header with disallowed characters', async () => {
    const res = await request(buildApp()).get('/echo').set('X-Request-Id', 'has spaces');
    expect(res.body.requestId).not.toBe('has spaces');
    expect(res.body.requestId).toMatch(UUID_RE);
  });

  it('replaces an inbound header that is too long', async () => {
    const tooLong = 'a'.repeat(200);
    const res = await request(buildApp()).get('/echo').set('X-Request-Id', tooLong);
    expect(res.body.requestId).not.toBe(tooLong);
    expect(res.body.requestId).toMatch(UUID_RE);
  });

  it('isolates request IDs across concurrent requests', async () => {
    const app = buildApp();
    const [a, b] = await Promise.all([
      request(app).get('/echo').set('X-Request-Id', 'req-a'),
      request(app).get('/echo').set('X-Request-Id', 'req-b'),
    ]);
    expect(a.body.requestId).toBe('req-a');
    expect(b.body.requestId).toBe('req-b');
  });
});
