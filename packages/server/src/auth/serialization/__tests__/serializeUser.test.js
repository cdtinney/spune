const serializeUser = require('../serializeUser');

describe('serializeUser()', () => {
  it('serializes spotifyId and calls done() when given a valid user object', () => {
    const mockDone = jest.fn();
    serializeUser({
      spotifyId: 'foo',
    }, mockDone);
    expect(mockDone).toHaveBeenCalledWith(null, 'foo'); // First arg is error
  });
});
