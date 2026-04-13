const passportStrategy = require('../passportStrategy');
const { findOrCreateUser } = require('../../../database/queries/userQueries');

jest.mock('../../../database/queries/userQueries', () => ({
  findOrCreateUser: jest.fn(),
}));

describe('passportStrategy', () => {
  describe('verify', () => {
    it('calls findOrCreateUser with the spotifyId', () => {
      findOrCreateUser.mockResolvedValue({ spotifyId: 'foo' });
      passportStrategy.verify(null, null, null, { id: 'foo' }, jest.fn());
      expect(findOrCreateUser.mock.calls[0][0]).toEqual('foo');
    });

    it('calls done() when the user is found or created', (done) => {
      findOrCreateUser.mockResolvedValue({ spotifyId: 'foo' });
      passportStrategy.verify(null, null, null, { id: 'foo' }, (err, user) => {
        expect(err).toBeNull();
        expect(user).toEqual({ spotifyId: 'foo' });
        done();
      });
    });
  });
});
