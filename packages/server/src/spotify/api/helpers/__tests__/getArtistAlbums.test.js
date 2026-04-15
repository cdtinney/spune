const getArtistAlbums = require('../getArtistAlbums');

const mockSpotifyApi = {
  artists: {
    albums: jest.fn().mockImplementation(() =>
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
});
