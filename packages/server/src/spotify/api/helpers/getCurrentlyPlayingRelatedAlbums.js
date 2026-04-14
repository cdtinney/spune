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
    logger.warn(`Album search failed for "${query}" offset=${offset}: ${error.message}`);
    return [];
  }
}

async function getArtistGenres(spotifyApi, artistId) {
  try {
    const artist = await spotifyApi.artists.get(artistId);
    return artist.genres || [];
  } catch {
    return [];
  }
}

async function searchRelatedAlbums(spotifyApi, artistNames, artistIds) {
  const searches = [];

  // Search by artist name (general keyword — returns albums mentioning the artist)
  for (const name of artistNames.slice(0, 2)) {
    searches.push(searchAlbums(spotifyApi, name, 50, 0));
    searches.push(searchAlbums(spotifyApi, name, 50, 50));
  }

  // Search by artist name with artist: filter (strict — albums BY the artist)
  for (const name of artistNames.slice(0, 2)) {
    searches.push(searchAlbums(spotifyApi, `artist:"${name}"`, 50, 0));
  }

  // Fetch genres and search by them
  const genres = await getArtistGenres(spotifyApi, artistIds[0]);
  for (const genre of genres.slice(0, 3)) {
    searches.push(searchAlbums(spotifyApi, `genre:"${genre}"`, 50, 0));
    searches.push(searchAlbums(spotifyApi, `genre:"${genre}"`, 50, 50));
  }

  const results = await Promise.all(searches);
  const allAlbums = results.flat();
  logger.info(`Search yielded ${allAlbums.length} albums (${artistNames.length} artist names, ${genres.length} genres)`);
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

  const [searchedAlbums, ...artistAlbumResults] = await Promise.all([
    searchRelatedAlbums(spotifyApi, artistNames, trackArtistIds),
    ...trackArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  ]);

  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  const combined = uniqueAlbums([...searchedAlbums, ...artistAlbums]);
  logger.info(`Combined unique albums: ${combined.length}`);

  return combined;
};
