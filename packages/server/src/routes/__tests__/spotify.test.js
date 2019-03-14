const request = require('supertest');
const { Router } = require('express');

const logger = require('../../logger');

const apiRequestWithRefresh = require('../../spotify/api/helpers/apiRequestWithRefresh');
const spotify = require('../spotify');
const initApp = require('../../initApp');

jest.mock('../../spotify/api/helpers/apiRequestWithRefresh');

const app = initApp();

describe('/spotify', () => {
  it('exports an instance of Router', () => {
    expect(Object.getPrototypeOf(spotify))
      .toEqual(Router);
  });

  describe('/spotify/currently-playing/', () => {
    describe('/spotify/currently-playing/related-albums', () => {
      it('returns 200 when the underlying API request succeeds', async () => {
        apiRequestWithRefresh.mockImplementation(() => ({
          message: 'success',
        }));

        try {
          const response = await request(app)
            .get('/api/spotify/currently-playing/related-albums');

          expect(response.statusCode).toEqual(200);
          expect(response.body).toEqual({
            message: 'success',
          });
        } catch (error) {
          logger.error(error);
        }
      });

      it('returns 500 when errors are thrown by the underlying API request', async () => {
        apiRequestWithRefresh.mockImplementation(() => {
          throw new Error('foo');
        });

        const response = await request(app)
          .get('/api/spotify/currently-playing/related-albums');

        expect(response.statusCode).toEqual(500);
        expect(response.text).toEqual('foo');
      });
    });
  });

  describe('/spotify/me', () => {
    it('returns 200 when the API request is successful', async () => {
      apiRequestWithRefresh.mockImplementation(() => ({
        body: {
          profile: 'foo',
        },
      }));

      const response = await request(app).get('/api/spotify/me');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        profile: 'foo',
      });
    });

    it('returns 500 when non-auth errors are thrown', async () => {
      apiRequestWithRefresh.mockImplementation(() => {
        throw new Error('foo');
      });

      const response = await request(app).get('/api/spotify/me')
        .query({
          songId: 'foo',
        });
      expect(response.statusCode).toEqual(500);
      expect(response.text).toEqual('foo');
    });

  });
  describe('/spotify/me/player', () => {
    it('returns 200 when the underlying API request suceeds', async () => {
      apiRequestWithRefresh.mockImplementation(() => ({
        body: {
          message: 'success',
        },
      }));

      const response = await request(app).get('/api/spotify/me/player');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        message: 'success',
      });
    });

    it('returns 500 when non-auth errors are thrown by the API request', async () => {
      apiRequestWithRefresh.mockImplementation(() => {
        throw new Error('foo');
      });

      const response = await request(app).get('/api/spotify/me/player');
      expect(response.statusCode).toEqual(500);
      expect(response.text).toEqual('foo');
    });
  });
});
