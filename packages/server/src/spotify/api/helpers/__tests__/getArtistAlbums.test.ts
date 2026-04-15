import { describe, it, expect, vi, beforeEach } from 'vitest';
import getArtistAlbums from '../getArtistAlbums';
import { artistAlbumsCache } from '../../../../cache';

const mockSpotifyApi = {
  artists: {
    albums: vi.fn().mockImplementation(() =>
      Promise.resolve({
        items: [
          {
            name: 'foo',
          },
          {
            name: 'foo',
          },
        ],
      }),
    ),
  },
};

describe('getArtistAlbums()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistAlbumsCache.clear();
  });

  it('returns unique albums for the artist from the api', async () => {
    const result = await getArtistAlbums(mockSpotifyApi, 'fooId');
    expect(result).toEqual({
      artistId: 'fooId',
      albums: [
        {
          name: 'foo',
        },
      ],
    });
  });

  it('returns cached results on subsequent calls without additional API calls', async () => {
    const first = await getArtistAlbums(mockSpotifyApi, 'fooId');
    const callCount = mockSpotifyApi.artists.albums.mock.calls.length;

    const second = await getArtistAlbums(mockSpotifyApi, 'fooId');
    expect(second).toEqual(first);
    expect(mockSpotifyApi.artists.albums.mock.calls.length).toBe(callCount);
  });
});
