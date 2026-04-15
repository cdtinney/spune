import { describe, it, expect, vi } from 'vitest';
import { verify } from '../passportStrategy';
import { findOrCreateUser } from '../../../database/queries/userQueries';
import type { User } from '../../../types';
import type { SpotifyProfile } from 'passport-spotify';

vi.mock('../../../database/queries/userQueries', () => ({
  findOrCreateUser: vi.fn(),
}));

const mockedFindOrCreateUser = vi.mocked(findOrCreateUser);

const mockProfile = {
  id: 'foo',
  displayName: 'Foo',
  photos: [],
  provider: 'spotify',
} as SpotifyProfile;

const mockUser = { spotifyId: 'foo' } as User;

describe('passportStrategy', () => {
  describe('verify', () => {
    it('calls findOrCreateUser with the spotifyId', () => {
      mockedFindOrCreateUser.mockResolvedValue(mockUser);
      verify('token', 'refresh', 3600, mockProfile, vi.fn());
      expect(mockedFindOrCreateUser.mock.calls[0][0]).toEqual('foo');
    });

    it('calls done() when the user is found or created', async () => {
      mockedFindOrCreateUser.mockResolvedValue(mockUser);

      await new Promise<void>((resolve) => {
        verify('token', 'refresh', 3600, mockProfile, (err: Error | null, user: unknown) => {
          expect(err).toBeNull();
          expect(user).toEqual({ spotifyId: 'foo' });
          resolve();
        });
      });
    });
  });
});
