module.exports = async function getRelatedArtists(spotifyApi, trackArtists) {
  const relatedArtistsReqs = trackArtists
    .map((artistId) => {
      return spotifyApi.getArtistRelatedArtists(artistId)
        .then(response => response.body.artists)
        .catch(error => console.error(error));
    });
  return Promise.all(relatedArtistsReqs)
    .then((relatedArtists) => {
      // First, flatten the arrays of artists.
      return relatedArtists.reduce((flattened, arr) => {
          return flattened.concat(arr);
        }, [])
        // Filter out undefined artists.
        .filter(artist => artist !== undefined && artist !== null)
        // Then, take only their IDs.
        .map(artist => artist.id)
    // Finally, merge related artists and track artists into
    // a set for uniqueness.
    }).then((relatedArtistsIds) => {
      const combinedArtistsIds = relatedArtistsIds.concat(trackArtists);
      return [...new Set(combinedArtistsIds)]; // Spread to convert to array
    });
};
