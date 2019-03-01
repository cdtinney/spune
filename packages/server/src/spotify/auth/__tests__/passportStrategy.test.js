const passportStrategy = require('../passportStrategy');
const User = require('../../../database/schema/User');

jest.mock('../../../database/schema/User', () => ({
  findOrCreate: jest.fn(),
}));

describe('passportStrategy', () => {
  describe('verify', () => {
    it('filters based on spotifyId when finding users', () => {
      passportStrategy.verify(null, null, null, { id: 'foo' });
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
      passportStrategy.verify(null, null, null, { id: 'foo: ' }, mockDone);
      expect(mockDone).toHaveBeenCalledWith(null, {
        spotifyId: 'foo',
      });
    });
  });
});
