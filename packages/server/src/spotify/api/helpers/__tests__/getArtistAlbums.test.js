const getArtistAlbums = require('../getArtistAlbums');

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

describe('getArtistAlbums()', () => {
  it('returns unique albums for the artist from the api', async () => {
    const result = await getArtistAlbums(mockSpotifyApi, 'fooId');
    expect(result).toEqual({
      artistId: 'fooId',
      albums: [{
        name: 'foo',
      }],
    });
  });

  it('requests all album types from the api', async () => {
    await getArtistAlbums(mockSpotifyApi, 'fooId');
    // If `options` are undefined, it means the default will be used
    // `album_group` param will be used which is all albums.
    expect(mockSpotifyApi.getArtistAlbums.mock.calls[0][1]).toEqual(undefined);
  });
});
