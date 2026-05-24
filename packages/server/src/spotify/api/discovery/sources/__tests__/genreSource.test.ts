import { describe, it, expect, vi, beforeEach } from 'vitest';
import { genreSource } from '../genreSource';
import getArtistAlbums from '../../../helpers/getArtistAlbums';
import { genreArtistsCache } from '../../../../../cache';
import { makeContext, mockSpotifyApi } from './helpers';

vi.mock('../../../helpers/getArtistAlbums');
const mockedGetArtistAlbums = vi.mocked(getArtistAlbums);

describe('genreSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    genreArtistsCache.clear();
  });

  it('fetches genres for primary artist and searches for similar', async () => {
    mockSpotifyApi.artists.get.mockResolvedValue({ genres: ['indie rock', 'shoegaze'] });
    mockSpotifyApi.search.mockResolvedValue({
      artists: { items: [{ id: 'g1' }, { id: 'g2' }, { id: 'a1' }] },
    });
    mockedGetArtistAlbums.mockResolvedValue({
      artistId: 'g1',
      albums: [{ name: 'Genre Album' }],
    } as any);

    await genreSource.discover(makeContext());

    expect(mockSpotifyApi.artists.get).toHaveBeenCalledWith('a1');
    expect(mockSpotifyApi.search).toHaveBeenCalledWith(
      'genre:"indie rock" genre:"shoegaze"',
      ['artist'],
      undefined,
      20,
    );
    expect(mockedGetArtistAlbums).toHaveBeenCalledTimes(2);
  });

  it('returns empty when artist has no genres', async () => {
    mockSpotifyApi.artists.get.mockResolvedValue({ genres: [] });

    const albums = await genreSource.discover(makeContext());

    expect(albums).toHaveLength(0);
    expect(mockSpotifyApi.search).not.toHaveBeenCalled();
  });

  it('returns empty when no song artists', async () => {
    const albums = await genreSource.discover(makeContext({ songArtists: [] }));
    expect(albums).toHaveLength(0);
  });

  it('returns empty on API failure', async () => {
    mockSpotifyApi.artists.get.mockRejectedValue(new Error('fail'));

    const albums = await genreSource.discover(makeContext());
    expect(albums).toHaveLength(0);
  });
});
