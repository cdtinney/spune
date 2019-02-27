const passport = require('passport');
const auth = require('../auth');
const paths = require('../../config/paths');

jest.mock('passport');

describe('/auth', () => {
  it('initializes routes without errors when given a router', () => {
    const mockRouter = {
      get: jest.fn(),
    };

    auth(mockRouter);
  });

  describe('/auth/user', () => {
    it('returns a serialized empty object when the request has no user', () => {
      const mockRes = {
        json: jest.fn(),
      };

      auth.authUser({}, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith({});
    });

    it('returns a serialized user object when the request has a user', () => {
      const mockRes = {
        json: jest.fn(),
      };

      auth.authUser({
        user: {
          name: 'foo',
        },
      }, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        user: {
          name: 'foo',
        },
      });
    });
  });

  describe('/auth/spotify', () => {
    it('authenticates the spotify passport strategy with permission scopes', () => {
      auth.authSpotify();
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
    it('authenticates the spotify passport strategy with callbacks for success and failure', () => {
      auth.authSpotifyCallback();
      expect(passport.authenticate).toHaveBeenCalledWith('spotify', {
        successRedirect: paths.clientHome,
        failureRedirect: paths.clientLogin,
      });
    });
  });
});
