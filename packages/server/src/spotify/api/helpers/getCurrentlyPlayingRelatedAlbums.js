const getArtistAlbums = require('./getArtistAlbums');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');
const logger = require('../../../logger');

async function searchAlbums(spotifyApi, query, limit = 50, offset = 0) {
  try {
    const results = await spotifyApi.search(query, ['album'], undefined, limit, offset);
    const albums = results.albums?.items || [];
    return albums.filter(a => a.images?.length > 0 && a.album_type !== 'single');
  } catch (error) {
    logger.warn(`Album search failed for "${query}": ${error.message}`);
    return [];
  }
}

async function searchRelatedAlbums(spotifyApi, artistNames) {
  // Run multiple searches in parallel to build a large diverse pool:
  // - Two pages per artist name (offset 0 and 50)
  const searches = [];
  for (const name of artistNames.slice(0, 3)) {
    searches.push(searchAlbums(spotifyApi, `artist:"${name}"`, 50, 0));
    searches.push(searchAlbums(spotifyApi, `artist:"${name}"`, 50, 50));
  }

  const results = await Promise.all(searches);
  const allAlbums = results.flat();
  logger.info(`Search yielded ${allAlbums.length} albums from ${artistNames.length} artist name(s)`);
  return allAlbums;
}

module.exports = async function getCurrentlyPlayingRelatedAlbums(spotifyApi, songId) {
  const response = await spotifyApi.player.getCurrentlyPlayingTrack();
  const { item: { id, artists: songArtists, album: { artists: albumArtists } } } = response;

  logger.info(`Currently playing: "${response.item.name}" by ${songArtists.map(a => a.name).join(', ')} (songId=${id})`);

  if (songId !== id) {
    return Promise.reject(new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`));
  }

  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });
  const artistNames = songArtists.map(a => a.name);

  // Fetch searched albums and artist albums in parallel
  const [searchedAlbums, ...artistAlbumResults] = await Promise.all([
    searchRelatedAlbums(spotifyApi, artistNames),
    ...trackArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  ]);

  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  const combined = uniqueAlbums([...searchedAlbums, ...artistAlbums]);
  logger.info(`Combined unique albums: ${combined.length}`);

  return combined;
};
