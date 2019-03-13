const getRelatedArtists = require('./getRelatedArtists');
const getArtistStudioAlbums = require('./getArtistStudioAlbums');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');

module.exports = async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.getMyCurrentPlayingTrack();
  const {
    item: {
      id,
      artists: songArtists,
      album: {
        artists: albumArtists,
      },
    },
  } = response.body;

  // ID mismatch -- the song has likely changed (this is a race condition).
  if (songId !== id) {
    return Promise.reject(
      new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`),
    );
  }

  const combinedArtists = combineTrackArtists({
    songArtists,
    albumArtists,
  });

  const relatedArtistIds = await getRelatedArtists(spotifyApi, combinedArtists);
  const albumsByArtist = await Promise.all(
    [...relatedArtistIds]
      .map(artistId => getArtistStudioAlbums(spotifyApi, artistId)),
  );

  // Some artists share albums but they have different IDs. They will
  // likely have matching names so we can further reduce duplicates at this
  // final stage.
  return uniqueAlbums(
    albumsByArtist.reduce((arr, curr) => arr.concat(curr.albums), []),
  );
};
