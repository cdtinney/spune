const auth = require('../auth');

describe('/auth', () => {
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
});
