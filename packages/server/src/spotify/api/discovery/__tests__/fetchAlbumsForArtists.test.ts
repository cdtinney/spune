import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchAlbumsForNames, fetchAlbumsForIds } from '../fetchAlbumsForArtists';
import resolveArtistId from '../../helpers/resolveArtistId';
import getArtistAlbums from '../../helpers/getArtistAlbums';
import { artistIdCache, artistAlbumsCache } from '../../../../cache';

vi.mock('../../helpers/resolveArtistId');
vi.mock('../../helpers/getArtistAlbums');

const mockedResolve = vi.mocked(resolveArtistId);
const mockedAlbums = vi.mocked(getArtistAlbums);

const mockApi = {} as any;

function albumResult(artistId: string, count: number) {
  return {
    artistId,
    albums: Array.from({ length: count }, (_, i) => ({ name: `${artistId}-album-${i}` })),
  } as any;
}

describe('fetchAlbumsForNames()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistIdCache.clear();
    artistAlbumsCache.clear();
  });

  it('resolves names to IDs and fetches their albums', async () => {
    mockedResolve.mockResolvedValueOnce('id1').mockResolvedValueOnce('id2');
    mockedAlbums.mockImplementation((_, id) => Promise.resolve(albumResult(id as string, 2)));

    const albums = await fetchAlbumsForNames(mockApi, ['A', 'B'], new Set(), 100);

    expect(albums).toHaveLength(4);
    expect(mockedResolve).toHaveBeenCalledTimes(2);
  });

  it('skips names that resolve to excluded IDs', async () => {
    mockedResolve.mockResolvedValue('excluded-id');

    const albums = await fetchAlbumsForNames(mockApi, ['Skip'], new Set(['excluded-id']), 100);

    expect(albums).toHaveLength(0);
    expect(mockedAlbums).not.toHaveBeenCalled();
  });

  it('skips names that resolve to null', async () => {
    mockedResolve.mockResolvedValue(null);

    const albums = await fetchAlbumsForNames(mockApi, ['Unknown'], new Set(), 100);

    expect(albums).toHaveLength(0);
    expect(mockedAlbums).not.toHaveBeenCalled();
  });

  it('stops when maxAlbums is reached', async () => {
    mockedResolve.mockImplementation((_, name) => Promise.resolve(`id-${name}`));
    mockedAlbums.mockImplementation((_, id) => Promise.resolve(albumResult(id as string, 10)));

    // 6 names but maxAlbums=15 — first batch of 5 yields 50 albums, should stop
    const names = ['A', 'B', 'C', 'D', 'E', 'F'];
    const albums = await fetchAlbumsForNames(mockApi, names, new Set(), 15);

    // First batch of 5 resolves and fetches (50 albums), second batch never runs
    expect(albums).toHaveLength(50);
    expect(mockedResolve).toHaveBeenCalledTimes(5);
  });
});

describe('fetchAlbumsForIds()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    artistAlbumsCache.clear();
  });

  it('fetches albums for each ID', async () => {
    mockedAlbums.mockImplementation((_, id) => Promise.resolve(albumResult(id as string, 3)));

    const albums = await fetchAlbumsForIds(mockApi, ['x', 'y'], 100);

    expect(albums).toHaveLength(6);
    expect(mockedAlbums).toHaveBeenCalledTimes(2);
  });

  it('stops when maxAlbums is reached', async () => {
    mockedAlbums.mockImplementation((_, id) => Promise.resolve(albumResult(id as string, 20)));

    await fetchAlbumsForIds(mockApi, ['a', 'b', 'c', 'd', 'e', 'f'], 5);

    // First batch of 5 yields 100 albums, second batch never runs
    expect(mockedAlbums).toHaveBeenCalledTimes(5);
  });
});
