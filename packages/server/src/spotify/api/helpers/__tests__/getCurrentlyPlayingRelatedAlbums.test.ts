import { describe, it, expect, vi, beforeEach } from 'vitest';
import getCurrentlyPlayingRelatedAlbums from '../getCurrentlyPlayingRelatedAlbums';
import getArtistAlbums from '../getArtistAlbums';
import runDiscovery from '../../discovery/runDiscovery';
import { discoveryResultCache } from '../../../../cache';

vi.mock('../getArtistAlbums');
vi.mock('../../discovery/runDiscovery');

const mockedGetArtistAlbums = vi.mocked(getArtistAlbums);
const mockedRunDiscovery = vi.mocked(runDiscovery);

const mockSpotifyApi = {
  player: { getCurrentlyPlayingTrack: vi.fn() },
};

function mockPlaying(id: string) {
  mockSpotifyApi.player.getCurrentlyPlayingTrack.mockResolvedValue({
    item: {
      id,
      name: 'Test Song',
      artists: [{ id: '1', name: 'Artist 1' }],
      album: { artists: [{ id: '1', name: 'Artist 1' }] },
    },
  });
}

describe('getCurrentlyPlayingRelatedAlbums()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    discoveryResultCache.clear();
  });

  it('rejects when playing track differs from requested songId', () => {
    mockPlaying('bar');
    expect(getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo')).rejects.toBeInstanceOf(Error);
  });

  it('combines artist albums with discovery source albums', async () => {
    mockPlaying('foo');
    mockedGetArtistAlbums.mockResolvedValue({ artistId: '1', albums: [{ name: 'A' }] } as any);
    mockedRunDiscovery.mockResolvedValue([{ name: 'B' }] as any);

    const result = await getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo');

    expect(result.map((a) => a.name)).toEqual(['A', 'B']);
    expect(mockedRunDiscovery).toHaveBeenCalledTimes(1);
  });

  it('returns cached result without calling Spotify API', async () => {
    mockPlaying('foo');
    mockedGetArtistAlbums.mockResolvedValue({ artistId: '1', albums: [{ name: 'A' }] } as any);
    mockedRunDiscovery.mockResolvedValue([]);

    await getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo');
    await getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo');

    expect(mockSpotifyApi.player.getCurrentlyPlayingTrack).toHaveBeenCalledTimes(1);
  });
});
