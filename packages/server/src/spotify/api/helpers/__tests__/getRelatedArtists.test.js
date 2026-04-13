const getRelatedArtists = require('../getRelatedArtists');

describe('validArtistIds()', () => {
  it('returns a flattened array of IDs when given a 2D array with both null and defined values', () => {
    const input = [[{
      id: 1,
    }, {
      id: 2,
    }, null], [{
      id: 3,
    }, {
      id: 4,
    }, undefined]];

    expect(getRelatedArtists.validArtistIds(input)).toEqual([
      1, 2, 3, 4,
    ]);
  });
});

describe('getRelatedArtists()', () => {
  it('requests related artists for each artist and combines into a unique set', async () => {
    const mockSpotifyApi = {
      artists: {
        relatedArtists: jest.fn().mockImplementation(artistId => Promise.resolve({
          artists: [{
            id: 3,
          }, {
            id: 4,
          }, {
            id: artistId * 5,
          }],
        })),
      },
    };
    const trackArtistIds = [1, 2];

    const relatedArtists = await getRelatedArtists(mockSpotifyApi, trackArtistIds);
    expect(Array.from(relatedArtists.values())).toEqual([
      3, 4, 5, 10,
    ]);
  });

  it('returns empty results when endpoint returns 403', async () => {
    const mockSpotifyApi = {
      artists: {
        relatedArtists: jest.fn().mockRejectedValue({ status: 403 }),
      },
    };

    const relatedArtists = await getRelatedArtists(mockSpotifyApi, ['artist1']);
    expect(Array.from(relatedArtists.values())).toEqual([]);
  });
});
