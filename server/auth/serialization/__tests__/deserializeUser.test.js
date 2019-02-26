const User = require('../../../database/schema/User');
const deserializeUser = require('../deserializeUser');

jest.mock('../../../database/schema/User', () => {
  return {
    findOne: jest.fn(),
  };
});

describe('deserializeUser', () => {
  it('calls done() with a user when the spotifyId matches a user in the database', () => {
    User.findOne.mockImplementation((filter, callback) => {
      callback(null, {
        name: 'foo',
      });
    });

    const mockDone = jest.fn();
    deserializeUser('fooId', mockDone);
    expect(mockDone).toHaveBeenCalledWith(null, {
      name: 'foo',
    });
  });
});
