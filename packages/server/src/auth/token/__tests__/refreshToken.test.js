const refresh = require('passport-oauth2-refresh');
const refreshToken = require('../refreshToken');

jest.mock('passport-oauth2-refresh', () => ({
  requestNewAccessToken: jest.fn(),
}));

jest.mock('../../../database/schema/User', () => ({
  findOneAndUpdate: jest.fn(),
}));

describe('refreshToken()', () => {
  it('returns a Promise', () => {
    expect(refreshToken('foo')).toBeInstanceOf(Promise);
  });

  it('rejects the promise if the refresh strategy fails', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done('fooError');
    });

    expect(refreshToken()).rejects.toEqual('fooError');
  });

  it('finds and updates the users access token when the refresh strategy succeeds', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done(null, 'newAccessToken');
    });

    Date.now = jest.fn().mockImplementation(() => 123);
    refreshToken('oldAccessToken');
    // expect(User.findOneAndUpdate.mock.calls[0][1]).toEqual({
    //   $set: {
    //     spotifyAccessToken: 'newAccessToken',
    //     tokenUpdated: 123,
    //   },
    // });
  });

  it('rejects the promise when the user update fails', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done(null, 'newAccessToken');
    });

    // User.findOneAndUpdate.mockImplementation((conditions, update, options, callback) => {
    //   callback('fooError');
    // });

    expect(refreshToken('accessToken')).rejects.toEqual('fooError');
  });

  it('resolves the promise when the user update fails', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done(null, 'newAccessToken');
    });

    // User.findOneAndUpdate.mockImplementation((conditions, update, options, callback) => {
    //   callback(null, {
    //     spotifyId: 'someUserId',
    //   });
    // });

    expect(refreshToken('accessToken')).resolves.toEqual({
      spotifyId: 'someUserId',
    });
  });
});
