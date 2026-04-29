import { describe, it, expect, vi, beforeEach } from 'vitest';
import resolveArtistId from '../resolveArtistId';
import { artistIdCache } from '../../../../cache';

const mockSpotifyApi = {
  search: vi.fn(),
};

describe('resolveArtistId()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistIdCache.clear();
  });

  it('returns the artist ID from Spotify search', async () => {
    mockSpotifyApi.search.mockResolvedValue({
      artists: { items: [{ id: 'abc123' }] },
    });

    const id = await resolveArtistId(mockSpotifyApi as any, 'Test Artist');

    expect(id).toBe('abc123');
    expect(mockSpotifyApi.search).toHaveBeenCalledWith('Test Artist', ['artist'], undefined, 1);
  });

  it('caches null for unknown artists and avoids repeat API calls', async () => {
    mockSpotifyApi.search.mockResolvedValue({ artists: { items: [] } });

    expect(await resolveArtistId(mockSpotifyApi as any, 'Unknown')).toBeNull();
    expect(await resolveArtistId(mockSpotifyApi as any, 'Unknown')).toBeNull();
    expect(mockSpotifyApi.search).toHaveBeenCalledTimes(1);
  });

  it('returns null on API error without caching', async () => {
    mockSpotifyApi.search.mockRejectedValue(new Error('API failure'));

    expect(await resolveArtistId(mockSpotifyApi as any, 'Error Artist')).toBeNull();
    expect(artistIdCache.get('error artist')).toBeUndefined();
  });
});
