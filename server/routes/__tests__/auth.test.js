const request = require('supertest');
const passport = require('passport');
const auth = require('../auth');
const paths = require('../../config/paths');
const initApp = require('../../initApp');

const app = initApp();

describe('/auth', () => {
  describe('/auth/user', () => {
    it('returns an empty object when the request has no user', async () => {
      const response = await request(app).get('/api/auth/user');
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({});
    });

    it('returns a serialized user object when the request has a user', async () => {
      // TODO
    });
  });

  describe('/auth/spotify', () => {
    beforeAll(() => {
      passport.authenticate = jest.fn();
    });

    it('authenticates the spotify passport strategy with permission scopes', async () => {
      await request(app).get('/api/auth/spotify');
      expect(passport.authenticate).toHaveBeenCalledWith('spotify', {
        scope: [
        'user-read-private',
        'user-read-email',
        'user-read-playback-state',
        ],
      });
    });
  });

  describe('/auth/spotify/callback', () => {
    it('authenticates the spotify passport strategy with callbacks for success and failure', async () => {
      await request(app).get('/api/auth/spotify/callback');
      expect(passport.authenticate).toHaveBeenCalledWith('spotify', {
        successRedirect: paths.clientHome,
        failureRedirect: paths.clientLogin,
      });
    });
  });
});
