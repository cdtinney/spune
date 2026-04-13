const refresh = require('passport-oauth2-refresh');
const { updateUserByRefreshToken } = require('../../../database/queries/userQueries');
const refreshToken = require('../refreshToken');

jest.mock('passport-oauth2-refresh', () => ({
  requestNewAccessToken: jest.fn(),
}));

jest.mock('../../../database/queries/userQueries', () => ({
  updateUserByRefreshToken: jest.fn(),
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

    updateUserByRefreshToken.mockResolvedValue({ spotifyId: 'someUserId' });
    Date.now = jest.fn().mockImplementation(() => 123);
    refreshToken('oldAccessToken');
    expect(updateUserByRefreshToken.mock.calls[0][1]).toEqual({
      spotifyAccessToken: 'newAccessToken',
      tokenUpdated: 123,
    });
  });

  it('rejects the promise when the user update fails', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done(null, 'newAccessToken');
    });

    updateUserByRefreshToken.mockRejectedValue('fooError');

    expect(refreshToken('accessToken')).rejects.toEqual('fooError');
  });

  it('resolves the promise when the user update succeeds', () => {
    refresh.requestNewAccessToken.mockImplementation((name, token, done) => {
      done(null, 'newAccessToken');
    });

    updateUserByRefreshToken.mockResolvedValue({ spotifyId: 'someUserId' });

    expect(refreshToken('accessToken')).resolves.toEqual({ spotifyId: 'someUserId' });
  });
});
