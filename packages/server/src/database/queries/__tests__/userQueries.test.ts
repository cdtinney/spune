import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db', () => ({
  pool: { query: vi.fn() },
}));

vi.mock('../../../auth/tokenCrypto', () => ({
  decryptToken: vi.fn(),
  encryptToken: vi.fn(),
}));

import { pool } from '../../db';
import { decryptToken } from '../../../auth/tokenCrypto';
import { findUserBySpotifyId } from '../userQueries';

const fakeRow = {
  id: 1,
  spotify_id: 'spot-1',
  spotify_access_token: 'enc-access',
  spotify_refresh_token: 'enc-refresh',
  token_updated: 123,
  expires_in: 3600,
  display_name: 'Alice',
  photos: [],
};

describe('findUserBySpotifyId()', () => {
  beforeEach(() => {
    vi.mocked(pool.query).mockReset();
    vi.mocked(decryptToken).mockReset();
  });

  it('returns null when no row matches', async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [] } as never);
    expect(await findUserBySpotifyId('missing')).toBeNull();
  });

  it('returns the user when tokens decrypt successfully', async () => {
    vi.mocked(pool.query).mockResolvedValue({ rows: [fakeRow] } as never);
    vi.mocked(decryptToken).mockImplementation((v: string) => `decrypted:${v}`);

    expect(await findUserBySpotifyId('spot-1')).toMatchObject({
      spotifyId: 'spot-1',
      spotifyAccessToken: 'decrypted:enc-access',
      spotifyRefreshToken: 'decrypted:enc-refresh',
    });
  });

  it('returns null when a stored token cannot be decrypted', async () => {
    // Legacy plaintext rows (from before encryption-at-rest) make decryptToken
    // throw. Without this branch, every authenticated request 500s in
    // passport's deserializeUser before the user can reach logout.
    vi.mocked(pool.query).mockResolvedValue({ rows: [fakeRow] } as never);
    vi.mocked(decryptToken).mockImplementation(() => {
      throw new Error('Token is not in encrypted format (missing version prefix).');
    });

    expect(await findUserBySpotifyId('spot-1')).toBeNull();
  });
});
