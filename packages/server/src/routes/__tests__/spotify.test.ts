import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { Router } from 'express';

import logger from '../../logger';

import apiRequestWithRefresh from '../../spotify/api/helpers/apiRequestWithRefresh';
import spotify from '../spotify';
import initApp from '../../initApp';

vi.mock('../../spotify/api/helpers/apiRequestWithRefresh');

const mockedApiRequestWithRefresh = vi.mocked(apiRequestWithRefresh);

const app = initApp();

describe('/spotify', () => {
  it('exports an instance of Router', () => {
    expect(Object.getPrototypeOf(spotify)).toEqual(Router);
  });

  describe('/spotify/currently-playing/', () => {
    describe('/spotify/currently-playing/related-albums', () => {
      it('returns 200 when the underlying API request succeeds', async () => {
        mockedApiRequestWithRefresh.mockImplementation(
          () =>
            ({
              message: 'success',
            }) as any,
        );

        try {
          const response = await request(app).get('/api/spotify/currently-playing/related-albums');

          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            message: 'success',
          });
        } catch (error) {
          logger.error(error);
        }
      });

      it('returns 500 when errors are thrown by the underlying API request', async () => {
        mockedApiRequestWithRefresh.mockImplementation(() => {
          throw new Error('foo');
        });

        const response = await request(app).get('/api/spotify/currently-playing/related-albums');

        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual('foo');
      });
    });
  });

  describe('/spotify/me/player', () => {
    it('returns 200 when the underlying API request suceeds', async () => {
      mockedApiRequestWithRefresh.mockImplementation(
        () =>
          ({
            body: {
              message: 'success',
            },
          }) as any,
      );

      const response = await request(app).get('/api/spotify/me/player');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        body: {
          message: 'success',
        },
      });
    });

    it('returns 500 when non-auth errors are thrown by the API request', async () => {
      mockedApiRequestWithRefresh.mockImplementation(() => {
        throw new Error('foo');
      });

      const response = await request(app).get('/api/spotify/me/player');
      expect(response.statusCode).toEqual(500);
      expect(response.text).toEqual('foo');
    });
  });
});
