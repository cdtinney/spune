import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from '../../createApp';

const app = createApp();

const ADMIN_ENDPOINTS = [
  '/api/admin/users',
  '/api/admin/sessions',
  '/api/admin/keepalive',
  '/api/admin/logs',
];

describe('/admin', () => {
  it.each(ADMIN_ENDPOINTS)('returns 401 for unauthenticated requests to %s', async (endpoint) => {
    const response = await request(app).get(endpoint);
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({ error: 'Unauthorized' });
  });
});
