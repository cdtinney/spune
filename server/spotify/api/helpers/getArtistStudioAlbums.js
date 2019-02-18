const uniqueAlbums = require('../../utils/uniqueAlbums');

module.exports = async function getArtistStudioAlbums(spotifyApi, artistId) {
  return spotifyApi.getArtistAlbums(artistId, {
    include_groups: 'album', // Ignore compilations/appears on/etc.
  }).then(data => ({
    artistId,
    albums: uniqueAlbums(data.body.items),
  }));
};
