import { describe, it, expect, vi } from 'vitest';
import refresh from 'passport-oauth2-refresh';
import { updateUserByRefreshToken } from '../../../database/queries/userQueries';
import refreshToken from '../refreshToken';

vi.mock('passport-oauth2-refresh', () => ({
  default: {
    requestNewAccessToken: vi.fn(),
  },
}));

vi.mock('../../../database/queries/userQueries', () => ({
  updateUserByRefreshToken: vi.fn(),
}));

const mockedRefresh = vi.mocked(refresh);
const mockedUpdateUserByRefreshToken = vi.mocked(updateUserByRefreshToken);

describe('refreshToken()', () => {
  it('returns a Promise', () => {
    expect(refreshToken('foo')).toBeInstanceOf(Promise);
  });

  it('rejects the promise if the refresh strategy fails', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done('fooError');
      },
    );

    expect(refreshToken()).rejects.toEqual('fooError');
  });

  it('finds and updates the users access token when the refresh strategy succeeds', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done(null, 'newAccessToken');
      },
    );

    mockedUpdateUserByRefreshToken.mockResolvedValue({ spotifyId: 'someUserId' } as any);
    Date.now = vi.fn().mockImplementation(() => 123);
    refreshToken('oldAccessToken');
    expect(mockedUpdateUserByRefreshToken.mock.calls[0][1]).toEqual({
      spotifyAccessToken: 'newAccessToken',
      tokenUpdated: 123,
    });
  });

  it('rejects the promise when the user update fails', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done(null, 'newAccessToken');
      },
    );

    mockedUpdateUserByRefreshToken.mockRejectedValue('fooError');

    expect(refreshToken('accessToken')).rejects.toEqual('fooError');
  });

  it('resolves the promise when the user update succeeds', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done(null, 'newAccessToken');
      },
    );

    mockedUpdateUserByRefreshToken.mockResolvedValue({ spotifyId: 'someUserId' } as any);

    expect(refreshToken('accessToken')).resolves.toEqual({ spotifyId: 'someUserId' });
  });
});
