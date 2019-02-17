const spotifyApi = require('./api/spotifyApi');

module.exports = async function getRelatedArtists(trackArtists) {
  const relatedArtistsReqs = trackArtists
    .map((artistId) =>{
      return spotifyApi.getArtistRelatedArtists(artistId)
        .then(data => data.body.artists);
        // TODO Error handling
    });
  return Promise.all(relatedArtistsReqs)
    .then((relatedArtists) => {
      // First, flatten the arrays of artists.
      return relatedArtists.reduce((flattened, arr) => {
          return flattened.concat(arr);
        }, [])
        // Then, take only their IDs.
        .map(artist => artist.id)
    // Finally, merge related artists and track artists into
    // a set for uniqueness.
    }).then((relatedArtistsIds) => {
      const combinedArtistsIds = relatedArtistsIds.concat(trackArtists);
      return [...new Set(combinedArtistsIds)]; // Spread to convert to array
    }).catch((error) => {
      console.error(error);
      // TODO Re-throw error
      return [];
    });
};
