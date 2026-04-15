'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = getCurrentlyPlayingRelatedAlbums;
const getArtistAlbums_1 = __importDefault(require('./getArtistAlbums'));
const getRelatedArtists_1 = __importDefault(require('./getRelatedArtists'));
const uniqueAlbums_1 = __importDefault(require('../../utils/uniqueAlbums'));
const combineTrackArtists_1 = __importDefault(require('../../utils/combineTrackArtists'));
const logger_1 = __importDefault(require('../../../logger'));
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
async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.player.getCurrentlyPlayingTrack();
  const {
    item: {
      id,
      artists: songArtists,
      album: { artists: albumArtists },
    },
  } = response;
  logger_1.default.info(
    `Currently playing: "${response.item.name}" by ${songArtists.map((a) => a.name).join(', ')} (songId=${id})`,
  );
  if (songId !== id) {
    return Promise.reject(
      new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`),
    );
  }
  const trackArtistIds = (0, combineTrackArtists_1.default)({ songArtists, albumArtists });
  const primaryArtistName = songArtists[0]?.name;
  // 1. Fetch track artists' own albums (always included, first priority)
  const artistAlbumResults = await Promise.all(
    trackArtistIds.map((artistId) => (0, getArtistAlbums_1.default)(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);
  logger_1.default.info(
    `Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`,
  );
  // 2. Get related artist names from Last.fm + ListenBrainz
  const relatedNames = await (0, getRelatedArtists_1.default)(primaryArtistName);
  // 3. Resolve related artist names to Spotify IDs and fetch their albums
  // Process in batches of 5 to avoid hammering the API
  const relatedAlbums = [];
  const trackArtistIdSet = new Set(trackArtistIds);
  for (let i = 0; i < relatedNames.length && relatedAlbums.length < 200; i += 5) {
    const batch = relatedNames.slice(i, i + 5);
    const ids = await Promise.all(batch.map((name) => resolveArtistId(spotifyApi, name)));
    const validIds = ids.filter(
      (resolvedId) => resolvedId !== null && !trackArtistIdSet.has(resolvedId),
    );
    const albumResults = await Promise.all(
      validIds.map((resolvedId) => (0, getArtistAlbums_1.default)(spotifyApi, resolvedId)),
    );
    for (const result of albumResults) {
      relatedAlbums.push(...result.albums);
    }
  }
  logger_1.default.info(`Related albums: ${relatedAlbums.length} from related artists`);
  // Artist albums first (priority), then related albums
  const combined = (0, uniqueAlbums_1.default)([...artistAlbums, ...relatedAlbums]);
  logger_1.default.info(`Combined unique albums: ${combined.length}`);
  return combined;
}
//# sourceMappingURL=getCurrentlyPlayingRelatedAlbums.js.map
