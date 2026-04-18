import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from '../../createApp';

const app = createApp();

describe('/status', () => {
  it('returns version, uptime, and startedAt', async () => {
    const response = await request(app).get('/api/status');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('startedAt');
    expect(typeof response.body.uptime).toBe('number');
  });
});
