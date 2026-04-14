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

  // Use the Recommendations API to discover related artists, since
  // Spotify removed the "Get Related Artists" endpoint in late 2024.
  // Seed with up to 5 of the track's artists (API limit).
  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });
  const seedArtists = trackArtistIds.slice(0, 5);

  let relatedArtistIds;
  try {
    const recs = await spotifyApi.recommendations.get({
      seed_artists: seedArtists.join(','),
      limit: 100,
    });
    // Extract unique artist IDs from recommended tracks
    const artistIdSet = new Set();
    for (const track of recs.tracks) {
      for (const artist of track.artists) {
        artistIdSet.add(artist.id);
      }
    }
    // Remove the seed artists themselves so we get truly "related" artists
    for (const id of trackArtistIds) {
      artistIdSet.delete(id);
    }
    relatedArtistIds = [...artistIdSet];
  } catch (error) {
    logger.warn(`Recommendations unavailable, falling back to track artists: ${error.message}`);
    relatedArtistIds = [];
  }

  // Combine related artists with the track's own artists for a fuller grid
  const allArtistIds = [...new Set([...trackArtistIds, ...relatedArtistIds])];

  const albumsByArtist = await Promise.all(
    allArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  );

  return uniqueAlbums(
    albumsByArtist.reduce((arr, curr) => arr.concat(curr.albums), []),
  );
};
