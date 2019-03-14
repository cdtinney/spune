const uniqueAlbums = require('../../utils/uniqueAlbums');

module.exports = async function getArtistAlbums(spotifyApi, artistId) {
  const data = await spotifyApi.getArtistAlbums(artistId);

  return {
    artistId,
    albums: uniqueAlbums(data.body.items),
  };
};
