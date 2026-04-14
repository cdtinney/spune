const uniqueAlbums = require('../../utils/uniqueAlbums');

module.exports = async function getArtistAlbums(spotifyApi, artistId) {
  const data = await spotifyApi.artists.albums(artistId, undefined, undefined, 50);

  return {
    artistId,
    albums: uniqueAlbums(data.items),
  };
};
