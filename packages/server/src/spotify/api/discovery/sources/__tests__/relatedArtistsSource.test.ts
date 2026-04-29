import { describe, it, expect, vi, beforeEach } from 'vitest';
import { relatedArtistsSource } from '../relatedArtistsSource';
import getRelatedArtists from '../../../helpers/getRelatedArtists';
import getArtistAlbums from '../../../helpers/getArtistAlbums';
import { artistIdCache } from '../../../../../cache';
import { makeContext, mockSpotifyApi } from './helpers';

vi.mock('../../../helpers/getRelatedArtists');
vi.mock('../../../helpers/getArtistAlbums');

const mockedGetRelatedArtists = vi.mocked(getRelatedArtists);
const mockedGetArtistAlbums = vi.mocked(getArtistAlbums);

describe('relatedArtistsSource', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistIdCache.clear();
  });

  it('fetches related artists for all song artists', async () => {
    mockedGetRelatedArtists.mockResolvedValue([]);

    await relatedArtistsSource.discover(
      makeContext({
        songArtists: [
          { id: 'a1', name: 'Artist One' },
          { id: 'a2', name: 'Artist Two' },
        ],
      }),
    );

    expect(mockedGetRelatedArtists).toHaveBeenCalledWith('Artist One');
    expect(mockedGetRelatedArtists).toHaveBeenCalledWith('Artist Two');
  });

  it('deduplicates names case-insensitively and resolves to albums', async () => {
    mockedGetRelatedArtists
      .mockResolvedValueOnce(['Related A', 'Related B'])
      .mockResolvedValueOnce(['related a', 'Related C']);

    mockSpotifyApi.search.mockResolvedValue({
      artists: { items: [{ id: 'resolved-id' }] },
    });
    mockedGetArtistAlbums.mockResolvedValue({
      artistId: 'resolved-id',
      albums: [{ name: 'Album' }],
    } as any);

    const albums = await relatedArtistsSource.discover(
      makeContext({
        songArtists: [
          { id: 'a1', name: 'Artist One' },
          { id: 'a2', name: 'Artist Two' },
        ],
      }),
    );

    // 3 unique names (Related A, Related B, Related C) — 'related a' deduped
    expect(mockSpotifyApi.search).toHaveBeenCalledTimes(3);
    expect(albums.length).toBeGreaterThan(0);
  });

  it('skips artists already in trackArtistIdSet', async () => {
    mockedGetRelatedArtists.mockResolvedValue(['Already There']);
    mockSpotifyApi.search.mockResolvedValue({ artists: { items: [{ id: 'a1' }] } });

    const albums = await relatedArtistsSource.discover(makeContext());

    expect(mockedGetArtistAlbums).not.toHaveBeenCalled();
    expect(albums).toHaveLength(0);
  });
});
