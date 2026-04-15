import { describe, it, expect, vi } from 'vitest';
import { verify } from '../passportStrategy';
import { findOrCreateUser } from '../../../database/queries/userQueries';

vi.mock('../../../database/queries/userQueries', () => ({
  findOrCreateUser: vi.fn(),
}));

const mockedFindOrCreateUser = vi.mocked(findOrCreateUser);

describe('passportStrategy', () => {
  describe('verify', () => {
    it('calls findOrCreateUser with the spotifyId', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedFindOrCreateUser.mockResolvedValue({ spotifyId: 'foo' } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verify(
        'token',
        'refresh',
        3600,
        { id: 'foo', displayName: 'Foo', photos: [] } as any,
        vi.fn(),
      );
      expect(mockedFindOrCreateUser.mock.calls[0][0]).toEqual('foo');
    });

    it('calls done() when the user is found or created', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mockedFindOrCreateUser.mockResolvedValue({ spotifyId: 'foo' } as any);

      await new Promise<void>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        verify(
          'token',
          'refresh',
          3600,
          { id: 'foo', displayName: 'Foo', photos: [] } as any,
          (err: Error | null, user: unknown) => {
            expect(err).toBeNull();
            expect(user).toEqual({ spotifyId: 'foo' });
            resolve();
          },
        );
      });
    });
  });
});
