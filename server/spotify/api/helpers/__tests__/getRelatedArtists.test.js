const getRelatedArtists = require('../getRelatedArtists');

describe('getRelatedArtists', () => {
  describe('validArtistIds', () => {
    it('returns a flattened array of IDs when given a 2D array with both null and defined values', () => {
      const input = [[{
        id: 1,
      }, {
        id: 2,
      }, null ], [{
        id: 3,
      }, {
        id: 4,
      }, undefined ]];

      expect(getRelatedArtists.validArtistIds(input)).toEqual([
        1, 2, 3, 4,
      ]);
    });
  });
});
