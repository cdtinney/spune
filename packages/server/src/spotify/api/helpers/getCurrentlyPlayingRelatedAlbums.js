const getArtistAlbums = require('./getArtistAlbums');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');
const logger = require('../../../logger');

module.exports = async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.player.getCurrentlyPlayingTrack();
  const { item: { id, artists: songArtists, album: { artists: albumArtists } } } = response;

  if (songId !== id) {
    return Promise.reject(new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`));
  }

  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });

  // Use the Recommendations API to discover similar music, since
  // Spotify removed the "Get Related Artists" endpoint in late 2024.
  // Seed with the track itself + up to 4 of its artists (5 seeds max).
  const seedArtists = trackArtistIds.slice(0, 4);
  let recommendedAlbums = [];
  try {
    const recs = await spotifyApi.recommendations.get({
      seed_artists: seedArtists.join(','),
      seed_tracks: songId,
      limit: 100,
    });

    // Extract albums directly from recommended tracks — each track
    // carries its album object with images, so no extra API calls needed.
    const seenAlbumIds = new Set();
    for (const track of recs.tracks) {
      if (track.album && track.album.images?.length > 0 && !seenAlbumIds.has(track.album.id)) {
        seenAlbumIds.add(track.album.id);
        recommendedAlbums.push(track.album);
      }
    }
  } catch (error) {
    logger.warn(`Recommendations unavailable, falling back to track artists: ${error.message}`);
  }

  // Also fetch the track's own artists' albums for a fuller pool
  const artistAlbumResults = await Promise.all(
    trackArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);

  return uniqueAlbums([...recommendedAlbums, ...artistAlbums]);
};
