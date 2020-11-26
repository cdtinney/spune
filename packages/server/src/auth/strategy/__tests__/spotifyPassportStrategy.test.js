const spotifyPassportStrategy = require('../spotifyPassportStrategy');
const User = require('../../../database/schema/User');

jest.mock('../../../database/schema/User', () => ({
  findOrCreate: jest.fn(),
}));

describe('spotifyPassportStrategy', () => {
  describe('verify', () => {
    it('filters based on spotifyId when finding users', () => {
      spotifyPassportStrategy.verify(null, null, null, { id: 'foo' });
      expect(User.findOrCreate.mock.calls[0][0]).toEqual({
        spotifyId: 'foo',
      });
    });

    it('calls done() when the user is found or created', () => {
      User.findOrCreate.mockImplementation((filter, properties, callback) => {
        callback(null, {
          spotifyId: 'foo',
        });
      });
      const mockDone = jest.fn();
      spotifyPassportStrategy.verify(null, null, null, { id: 'foo: ' }, mockDone);
      expect(mockDone).toHaveBeenCalledWith(null, {
        spotifyId: 'foo',
      });
    });
  });
});
