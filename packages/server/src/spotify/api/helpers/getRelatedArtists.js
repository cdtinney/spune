const logger = require('../../../logger');
const uniqueSet = require('../../../utils/uniqueSet');

function validArtistIds(artistArrs) {
  return artistArrs
    .reduce((flattened, arr) => flattened.concat(arr), [])
    .filter(artist => artist)
    .map(artist => artist.id);
}

module.exports = async function getRelatedArtists(spotifyApi, trackArtistIds) {
  const relatedArtistsReqs = trackArtistIds.map(async (artistId) => {
    try {
      const response = await spotifyApi.artists.relatedArtists(artistId);
      return response.artists;
    } catch (error) {
      if (error.status === 403) {
        logger.warn(`Related artists unavailable for ${artistId} (403). Falling back to empty list.`);
        return [];
      }
      logger.error(error);
      throw error;
    }
  });

  const relatedArtists = await Promise.all(relatedArtistsReqs);
  const relatedArtistIds = validArtistIds(relatedArtists);
  return uniqueSet(relatedArtistIds);
};

module.exports.validArtistIds = validArtistIds;
