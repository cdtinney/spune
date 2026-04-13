const { findUserBySpotifyId } = require('../../../database/queries/userQueries');
const deserializeUser = require('../deserializeUser');

jest.mock('../../../database/queries/userQueries', () => ({
  findUserBySpotifyId: jest.fn(),
}));

describe('deserializeUser()', () => {
  it('calls done() with a user when the spotifyId matches a user in the database', (done) => {
    findUserBySpotifyId.mockResolvedValue({ name: 'foo' });

    deserializeUser('fooId', (err, user) => {
      expect(err).toBeNull();
      expect(user).toEqual({ name: 'foo' });
      done();
    });
  });
});
