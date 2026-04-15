import { describe, it, expect, vi } from 'vitest';
import { findUserBySpotifyId } from '../../../database/queries/userQueries';
import deserializeUser from '../deserializeUser';

vi.mock('../../../database/queries/userQueries', () => ({
  findUserBySpotifyId: vi.fn(),
}));

describe('deserializeUser()', () => {
  it('calls done() with a user when the spotifyId matches a user in the database', async () => {
    vi.mocked(findUserBySpotifyId).mockResolvedValue({ name: 'foo' } as any);

    await new Promise<void>((resolve) => {
      deserializeUser('fooId', (err: Error | null, user?: Express.User | false | null) => {
        expect(err).toBeNull();
        expect(user).toEqual({ name: 'foo' });
        resolve();
      });
    });
  });
});
