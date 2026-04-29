import { describe, it, expect, vi } from 'vitest';
import refresh from 'passport-oauth2-refresh';
import { updateUserAccessTokenBySpotifyId } from '../../../database/queries/userQueries';
import refreshToken from '../refreshToken';

vi.mock('passport-oauth2-refresh', () => ({
  default: {
    requestNewAccessToken: vi.fn(),
  },
}));

vi.mock('../../../database/queries/userQueries', () => ({
  updateUserAccessTokenBySpotifyId: vi.fn(),
}));

const mockedRefresh = vi.mocked(refresh);
const mockedUpdate = vi.mocked(updateUserAccessTokenBySpotifyId);

describe('refreshToken()', () => {
  it('returns a Promise', () => {
    expect(refreshToken('someUserId', 'foo')).toBeInstanceOf(Promise);
  });

  it('rejects the promise if the refresh strategy fails', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done('fooError');
      },
    );

    expect(refreshToken('someUserId', 'oldRefresh')).rejects.toEqual('fooError');
  });

  it('updates the access token by spotifyId when the refresh strategy succeeds', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done(null, 'newAccessToken');
      },
    );

    mockedUpdate.mockResolvedValue({ spotifyId: 'someUserId' } as any);
    Date.now = vi.fn().mockImplementation(() => 123);
    refreshToken('someUserId', 'oldRefresh');
    expect(mockedUpdate.mock.calls[0][0]).toEqual('someUserId');
    expect(mockedUpdate.mock.calls[0][1]).toEqual({
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

    mockedUpdate.mockRejectedValue('fooError');

    expect(refreshToken('someUserId', 'oldRefresh')).rejects.toEqual('fooError');
  });

  it('resolves the promise when the user update succeeds', () => {
    mockedRefresh.requestNewAccessToken.mockImplementation(
      (_name: string, _token: string, done: (...args: unknown[]) => void) => {
        done(null, 'newAccessToken');
      },
    );

    mockedUpdate.mockResolvedValue({ spotifyId: 'someUserId' } as any);

    expect(refreshToken('someUserId', 'oldRefresh')).resolves.toEqual({ spotifyId: 'someUserId' });
  });
});
