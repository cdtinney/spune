const request = require('supertest');
const passport = require('passport');
const logger = require('../../logger');
const paths = require('../../config/paths');
const initApp = require('../../initApp');

const app = initApp();

describe('/auth', () => {
  describe('/auth/user', () => {
    it('returns an empty object when the request has no user', async () => {
      try {
        const response = await request(app)
          .get('/api/auth/user');

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({});
      } catch (error) {
        logger.error(error);
      }
    });

    it('returns a serialized user object when the request has a user', async () => {
      // TODO
    });
  });

  describe('/auth/user/logout', () => {
    it('logs out the user session and redirects to home', async () => {
      // TODO
    });
  });

  describe('/auth/spotify', () => {
    beforeAll(() => {
      passport.authenticate = jest.fn();
    });

    it.skip('authenticates the spotify passport strategy with permission scopes', async () => {
      try {
        await request(app)
          .get('/api/auth/spotify');

        expect(passport.authenticate).toHaveBeenCalledWith('spotify', {
          scope: [
            'user-read-private',
            'user-read-email',
            'user-read-playback-state',
          ],
        });
      } catch (error) {
        logger.error(error);
      }
    });
  });

  describe('/auth/spotify/callback', () => {
    it.skip('authenticates the spotify passport strategy with callbacks for success and failure', async () => {
      await request(app).get('/api/auth/spotify/callback');
      expect(passport.authenticate).toHaveBeenCalledWith('spotify', {
        successRedirect: paths.clientHome,
        failureRedirect: paths.clientLogin,
      });
    });
  });
});
