import { describe, it, expect, vi, beforeEach } from 'vitest';
import { twoHopSource } from '../twoHopSource';
import getRelatedArtists from '../../../helpers/getRelatedArtists';
import getArtistAlbums from '../../../helpers/getArtistAlbums';
import { artistIdCache } from '../../../../../cache';
import { makeContext, mockSpotifyApi } from './helpers';

vi.mock('../../../helpers/getRelatedArtists');
vi.mock('../../../helpers/getArtistAlbums');

const mockedGetRelatedArtists = vi.mocked(getRelatedArtists);
const mockedGetArtistAlbums = vi.mocked(getArtistAlbums);

describe('twoHopSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistIdCache.clear();
  });

  it('fetches related artists of top related artists', async () => {
    mockedGetRelatedArtists
      .mockResolvedValueOnce(['Related A', 'Related B'])
      .mockResolvedValueOnce(['Deep C', 'Related A'])
      .mockResolvedValueOnce(['Deep D']);

    mockSpotifyApi.search.mockResolvedValue({
      artists: { items: [{ id: 'deep-id' }] },
    });
    mockedGetArtistAlbums.mockResolvedValue({
      artistId: 'deep-id',
      albums: [{ name: 'Deep Album' }],
    } as any);

    const albums = await twoHopSource.discover(makeContext());

    expect(mockedGetRelatedArtists).toHaveBeenCalledTimes(3);
    // Deep C and Deep D (Related A filtered as 1st-hop duplicate)
    expect(mockSpotifyApi.search).toHaveBeenCalledTimes(2);
    expect(albums.length).toBeGreaterThan(0);
  });

  it('excludes first-hop names from results', async () => {
    mockedGetRelatedArtists
      .mockResolvedValueOnce(['Hop1'])
      .mockResolvedValueOnce(['Hop1', 'Hop2New']);

    mockSpotifyApi.search.mockResolvedValue({
      artists: { items: [{ id: 'h2' }] },
    });
    mockedGetArtistAlbums.mockResolvedValue({ artistId: 'h2', albums: [] } as any);

    await twoHopSource.discover(makeContext());

    expect(mockSpotifyApi.search).toHaveBeenCalledTimes(1);
    expect(mockSpotifyApi.search).toHaveBeenCalledWith('Hop2New', ['artist'], undefined, 1);
  });

  it('returns empty when no primary artist', async () => {
    const albums = await twoHopSource.discover(makeContext({ songArtists: [] }));
    expect(albums).toHaveLength(0);
  });
});
