const getCurrentlyPlayingRelatedAlbums = require('../getCurrentlyPlayingRelatedAlbums');

const getRelatedArtists = require('../getRelatedArtists');
const getArtistAlbums = require('../getArtistAlbums');

jest.mock('../getRelatedArtists');
jest.mock('../getArtistAlbums');

const mockSpotifyApi = {
  getMyCurrentPlayingTrack: jest.fn(),
};

describe('getCurrentlyPlayingRelatedAlbums()', () => {
  it('throws an error when the playing track is different than the request track', () => {
    mockSpotifyApi.getMyCurrentPlayingTrack
      .mockImplementation(() => (Promise.resolve({
        body: {
          item: {
            id: 'bar',
            artists: [],
            album: {
              artists: [],
            },
          },
        },
      })));

    expect(getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo'))
      .rejects.toBeInstanceOf(Error);
  });

  it('combines song artists, track artists, and related artists into a single object when successful', async () => {
    mockSpotifyApi.getMyCurrentPlayingTrack
      .mockImplementation(() => (Promise.resolve({
        body: {
          item: {
            id: 'foo',
            artists: [{
              id: 1,
            }, {
              id: 2,
            }],
            album: {
              artists: [{
                id: 1,
              }, {
                id: 2,
              }],
            },
          },
        },
      })));

    // Mock API functions.
    getRelatedArtists.mockImplementation(() => Promise.resolve([
      3, 4,
    ]));
    getArtistAlbums.mockImplementation((spotifyApi, artistId) => Promise.resolve({
      artistId,
      albums: [{
        name: 'cat',
      }, {
        name: 'dog',
      }],
    }));

    const relatedAlbums = await getCurrentlyPlayingRelatedAlbums(mockSpotifyApi, 'foo');
    expect(relatedAlbums).toEqual([{
      name: 'cat',
    }, {
      name: 'dog',
    }]);
  });
});
