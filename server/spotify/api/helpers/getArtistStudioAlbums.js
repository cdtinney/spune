const uniqueAlbums = require('../../utils/uniqueAlbums');

module.exports = async function getArtistStudioAlbums(spotifyApi, artistId) {
  const data = await spotifyApi.getArtistAlbums(artistId, {
    include_groups: 'album', // Ignore compilations/appears on/etc.
  });

  return {
    artistId,
    albums: uniqueAlbums(data.body.items),
  };
};
