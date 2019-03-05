/* eslint-disable prefer-promise-reject-errors */

const refreshToken = require('../../../auth/refreshToken');
const apiRequestWithRefresh = require('../apiRequestWithRefresh');

jest.mock('../../../auth/refreshToken');

describe('apiRequestWithRefresh', () => {
  beforeAll(() => {
    Date.now = jest.fn().mockImplementation(() => {
      return 2000;
    });
  });

  it('returns succesfully the user has a valid token and the API function succeeds', async () => {
    const result = await apiRequestWithRefresh({
      user: {
        spotifyAccessToken: 'foo',
        tokenUpdated: 1234,
        expiresIn: 1000,
      },
      apiFn: () => Promise.resolve('success'),
    });

    expect(result).toEqual('success');
  });

  it('refreshes the token when the user has an expired token', async () => {
    const user = {
      spotifyAccessToken: 'fooAccess',
      spotifyRefreshToken: 'barRefresh',
      tokenUpdated: 123,
      expiresIn :1000,
    };

    refreshToken.mockImplementation(() => Promise.resolve(user));

    const result = await apiRequestWithRefresh({
      user,
      apiFn: () => Promise.resolve('barSuccess'),
    });

    expect(refreshToken).toHaveBeenCalledWith(user.spotifyRefreshToken);
    expect(result).toEqual('barSuccess');
  });

  it('returns an error when the user has an expired token and the refresh request fails', async () => {
    const user = {
      spotifyAccessToken: 'fooAccess',
      spotifyRefreshToken: 'barRefresh',
      tokenUpdated: 123,
      expiresIn: 1000,
    };

    refreshToken.mockImplementation(() => Promise.reject('error'));

    try {
      await apiRequestWithRefresh({
        user,
      });
    } catch (error) {
      expect(error).toEqual('error');
    }
  });

  it('throws an error when the user does not have a token', async () => {
    const user = {
      spotifyAccessToken: undefined,
    };

    try {
      await apiRequestWithRefresh({
        user,
      });
    } catch (error) {
      expect(error).toEqual(new Error('Request has no user or access token'));
    }
  });
});
