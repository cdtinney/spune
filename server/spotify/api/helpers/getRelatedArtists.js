module.exports = async function getRelatedArtists(spotifyApi, trackArtists) {
  const relatedArtistsReqs = trackArtists
    .map(async (artistId) => {
      try {
        const response = await spotifyApi.getArtistRelatedArtists(artistId);
        return response.body.artists;
      } catch (error) {
        console.error(error);
      }
    });

  const relatedArtists = await Promise.all(relatedArtistsReqs);
  const relatedArtistIds =
    // First, flatten the arrays of artists.
    relatedArtists.reduce((flattened, arr) => {
      return flattened.concat(arr);
    }, [])
    // Filter out undefined artists.
    .filter(artist => artist !== undefined && artist !== null)
    // Then, take only their IDs.
    .map(artist => artist.id);

  // Make them unique.
  const combinedArtistsIds = relatedArtistIds.concat(trackArtists);
  return [...new Set(combinedArtistsIds)]; // Spread to convert to array
};
