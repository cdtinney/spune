import { describe, it, expect, vi } from 'vitest';
import getCurrentlyPlayingRelatedAlbums from '../getCurrentlyPlayingRelatedAlbums';

import getRelatedArtists from '../getRelatedArtists';
import getArtistAlbums from '../getArtistAlbums';

vi.mock('../getRelatedArtists');
vi.mock('../getArtistAlbums');

const mockedGetRelatedArtists = vi.mocked(getRelatedArtists);
const mockedGetArtistAlbums = vi.mocked(getArtistAlbums);

const mockSpotifyApi = {
  player: {
    getCurrentlyPlayingTrack: vi.fn(),
  },
};

describe('getCurrentlyPlayingRelatedAlbums()', () => {
  it('throws an error when the playing track is different than the request track', () => {
    mockSpotifyApi.player.getCurrentlyPlayingTrack.mockImplementation(() =>
      Promise.resolve({
        item: {
          id: 'bar',
          artists: [],
          album: {
            artists: [],
          },
        },
      }),
    );

    expect(getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo')).rejects.toBeInstanceOf(Error);
  });

  it('combines song artists, track artists, and related artists into a single object when successful', async () => {
    mockSpotifyApi.player.getCurrentlyPlayingTrack.mockImplementation(() =>
      Promise.resolve({
        item: {
          id: 'foo',
          artists: [
            {
              id: 1,
            },
            {
              id: 2,
            },
          ],
          album: {
            artists: [
              {
                id: 1,
              },
              {
                id: 2,
              },
            ],
          },
        },
      }),
    );

    mockedGetRelatedArtists.mockImplementation(() => Promise.resolve([3, 4]) as any);
    mockedGetArtistAlbums.mockImplementation(
      (_spotifyApi: any, artistId: string) =>
        Promise.resolve({
          artistId,
          albums: [
            {
              name: 'cat',
            },
            {
              name: 'dog',
            },
          ],
        }) as any,
    );

    const relatedAlbums = await getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo');
    expect(relatedAlbums).toEqual([
      {
        name: 'cat',
      },
      {
        name: 'dog',
      },
    ]);
  });
});
