const getArtistAlbums = require('./getArtistAlbums');
const getRelatedArtists = require('./getRelatedArtists');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');
const logger = require('../../../logger');

/**
 * Search Spotify for an artist by name and return their ID.
 */
async function resolveArtistId(spotifyApi, name) {
  try {
    const results = await spotifyApi.search(name, ['artist'], undefined, 1);
    return results.artists?.items?.[0]?.id || null;
  } catch {
    return null;
  }
}

module.exports = async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.player.getCurrentlyPlayingTrack();
  const { item: { id, artists: songArtists, album: { artists: albumArtists } } } = response;

  logger.info(`Currently playing: "${response.item.name}" by ${songArtists.map(a => a.name).join(', ')} (songId=${id})`);

  if (songId !== id) {
    return Promise.reject(new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`));
  }

  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });
  const primaryArtistName = songArtists[0]?.name;

  // 1. Fetch track artists' own albums (always included, first priority)
  const artistAlbumResults = await Promise.all(
    trackArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  // 2. Get related artist names from Last.fm + ListenBrainz
  const relatedNames = await getRelatedArtists(primaryArtistName);

  // 3. Resolve related artist names to Spotify IDs and fetch their albums
  // Process in batches of 5 to avoid hammering the API
  const relatedAlbums = [];
  const trackArtistIdSet = new Set(trackArtistIds);

  for (let i = 0; i < relatedNames.length && relatedAlbums.length < 200; i += 5) {
    const batch = relatedNames.slice(i, i + 5);
    const ids = await Promise.all(batch.map(name => resolveArtistId(spotifyApi, name)));

    const validIds = ids.filter(id => id && !trackArtistIdSet.has(id));
    const albumResults = await Promise.all(
      validIds.map(id => getArtistAlbums(spotifyApi, id)),
    );

    for (const result of albumResults) {
      relatedAlbums.push(...result.albums);
    }
  }

  logger.info(`Related albums: ${relatedAlbums.length} from related artists`);

  // Artist albums first (priority), then related albums
  const combined = uniqueAlbums([...artistAlbums, ...relatedAlbums]);
  logger.info(`Combined unique albums: ${combined.length}`);

  return combined;
};
