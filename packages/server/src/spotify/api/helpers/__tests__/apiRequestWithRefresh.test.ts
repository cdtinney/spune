import { describe, it, expect, vi, beforeAll } from 'vitest';
import refreshToken from '../../../auth/refreshToken';
import apiRequestWithRefresh from '../apiRequestWithRefresh';

vi.mock('../../../auth/refreshToken');

const mockedRefreshToken = vi.mocked(refreshToken);

describe('apiRequestWithRefresh()', () => {
  beforeAll(() => {
    Date.now = vi.fn().mockImplementation(() => 2000);
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
      expiresIn: 1000,
    };

    mockedRefreshToken.mockImplementation(() => Promise.resolve(user) as any);

    const result = await apiRequestWithRefresh({
      user,
      apiFn: () => Promise.resolve('barSuccess'),
    });

    expect(mockedRefreshToken).toHaveBeenCalledWith(user.spotifyRefreshToken);
    expect(result).toEqual('barSuccess');
  });

  it('returns an error when the user has an expired token and the refresh request fails', async () => {
    const user = {
      spotifyAccessToken: 'fooAccess',
      spotifyRefreshToken: 'barRefresh',
      tokenUpdated: 123,
      expiresIn: 1000,
    };

    mockedRefreshToken.mockImplementation(() => Promise.reject('error'));

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
