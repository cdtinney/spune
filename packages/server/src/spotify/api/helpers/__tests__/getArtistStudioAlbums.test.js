const getArtistStudioAlbums = require('../getArtistStudioAlbums');

const mockSpotifyApi = {
  getArtistAlbums: jest.fn().mockImplementation(() => Promise.resolve({
    body: {
      items: [{
        name: 'foo',
      }, {
        name: 'foo',
      }],
    },
  })),
};

describe('getArtistStudioAlbums', () => {
  it('returns unique albums for the artist from the api', async () => {
    const result = await getArtistStudioAlbums(mockSpotifyApi, 'fooId');
    expect(result).toEqual({
      artistId: 'fooId',
      albums: [{
        name: 'foo',
      }],
    });
  });

  it('requests only studio albums from the api', async () => {
    await getArtistStudioAlbums(mockSpotifyApi, 'fooId');
    expect(mockSpotifyApi.getArtistAlbums.mock.calls[0][1]).toEqual({
      include_groups: 'album',
    });
  });
});
