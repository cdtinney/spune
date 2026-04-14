const getArtistAlbums = require('./getArtistAlbums');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');

module.exports = async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.player.getCurrentlyPlayingTrack();
  const { item: { id, artists: songArtists, album: { artists: albumArtists } } } = response;

  if (songId !== id) {
    return Promise.reject(new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`));
  }

  // Spotify removed the "Get Related Artists" endpoint in late 2024.
  // Fall back to fetching albums from the track's own artists.
  const artistIds = combineTrackArtists({ songArtists, albumArtists });
  const albumsByArtist = await Promise.all(
    artistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  );

  return uniqueAlbums(
    albumsByArtist.reduce((arr, curr) => arr.concat(curr.albums), []),
  );
};
