const getRelatedArtists =
  require('./getRelatedArtists');
const getArtistStudioAlbums =
  require('./getArtistStudioAlbums');
const combineTrackArtists =
  require('../../utils/combineTrackArtists');

module.exports = function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  return spotifyApi.getMyCurrentPlayingTrack().then((response) => {
    const {
      item: {
        id,
        artists: songArtists,
        album: {
          artists: albumArtists,
        },
      },
    } = response.body;

    // ID mismatch
    if (songId !== id) {
      throw new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`);
    }

    return combineTrackArtists({
      songArtists,
      albumArtists,
    });
  }).then((trackArtists) => {
    return getRelatedArtists(spotifyApi, trackArtists);
  }).then((artistIds) => {
    const requests = [...artistIds]
      .map(artistId => getArtistStudioAlbums(spotifyApi, artistId));
    return Promise.all(requests);
  });
};
