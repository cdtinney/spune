const getArtistAlbums = require('./getArtistAlbums');
const uniqueAlbums = require('../../utils/uniqueAlbums');
const combineTrackArtists = require('../../utils/combineTrackArtists');
const logger = require('../../../logger');

async function searchRelatedAlbums(spotifyApi, artistNames) {
  const allAlbums = [];

  for (const name of artistNames.slice(0, 3)) {
    try {
      // Search for albums by similar artists using the artist name as a
      // tag query. The "tag:hipster" modifier biases toward lesser-known
      // results, giving more variety beyond the obvious hits.
      const results = await spotifyApi.search(`artist:"${name}"`, ['album'], undefined, 50);
      const albums = results.albums?.items || [];
      logger.info(`Search for artist:"${name}" returned ${albums.length} albums`);
      for (const album of albums) {
        if (album.images?.length > 0) {
          allAlbums.push(album);
        }
      }
    } catch (error) {
      logger.warn(`Album search failed for "${name}": ${error.message}`);
    }
  }

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

  // Search for albums by similar artists using the Spotify Search API.
  // The Related Artists and Recommendations endpoints were removed in late 2024.
  const searchedAlbums = await searchRelatedAlbums(spotifyApi, artistNames);
  logger.info(`Search yielded ${searchedAlbums.length} total albums from ${artistNames.length} artist name(s)`);

  // Also fetch the track's own artists' albums
  const artistAlbumResults = await Promise.all(
    trackArtistIds.map(artistId => getArtistAlbums(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce((arr, curr) => arr.concat(curr.albums), []);
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  const combined = uniqueAlbums([...searchedAlbums, ...artistAlbums]);
  logger.info(`Combined unique albums: ${combined.length}`);

  return combined;
};
