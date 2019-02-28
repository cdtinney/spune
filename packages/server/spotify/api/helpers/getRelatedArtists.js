const uniqueSet = require('../../../utils/uniqueSet');

function validArtistIds(artistArrs) {
  return artistArrs
    // Flatten the 2D array.
    .reduce((flattened, arr) => {
      return flattened.concat(arr);
    }, [])
    // Filter out undefined artists.
    .filter(artist => artist)
    // Then, take only their IDs.
    .map(artist => artist.id);
}

module.exports = async function getRelatedArtists(spotifyApi, trackArtistIds) {
  const relatedArtistsReqs = trackArtistIds
    .map(async (artistId) => {
      try {
        const response = await spotifyApi.getArtistRelatedArtists(artistId);
        return response.body.artists;
      } catch (error) {
        console.error(error);
      }
    });

  const relatedArtists = await Promise.all(relatedArtistsReqs);
  const relatedArtistIds = validArtistIds(relatedArtists);
  return uniqueSet(relatedArtistIds);
};

module.exports.validArtistIds = validArtistIds;
