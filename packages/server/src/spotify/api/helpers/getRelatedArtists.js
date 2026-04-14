const axios = require('axios');
const logger = require('../../../logger');

const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Get similar artists via Last.fm's artist.getSimilar endpoint.
 * Returns an array of artist names ranked by similarity.
 */
async function fromLastFm(artistName, limit = 30) {
  const apiKey = process.env.LAST_FM_API_KEY;
  if (!apiKey) {
    logger.warn('LAST_FM_API_KEY not set, skipping Last.fm');
    return [];
  }

  try {
    const { data } = await axios.get(LASTFM_BASE, {
      params: {
        method: 'artist.getSimilar',
        artist: artistName,
        api_key: apiKey,
        format: 'json',
        limit,
      },
    });

    const artists = data?.similarartists?.artist || [];
    const names = artists.map(a => a.name);
    logger.info(`Last.fm: ${names.length} similar artists for "${artistName}"`);
    return names;
  } catch (error) {
    logger.warn(`Last.fm failed for "${artistName}": ${error.message}`);
    return [];
  }
}

/**
 * Get similar artists via ListenBrainz.
 * Requires resolving the artist name to a MusicBrainz ID first.
 */
async function fromListenBrainz(artistName, limit = 20) {
  try {
    // Step 1: Resolve artist name to MusicBrainz ID
    const mbRes = await axios.get('https://musicbrainz.org/ws/2/artist/', {
      params: { query: artistName, fmt: 'json', limit: 1 },
      headers: { 'User-Agent': 'Spune/1.0 (https://github.com/cdtinney/spune)' },
    });

    const mbArtist = mbRes.data?.artists?.[0];
    if (!mbArtist?.id) {
      logger.warn(`MusicBrainz: no match for "${artistName}"`);
      return [];
    }

    const mbid = mbArtist.id;
    logger.info(`MusicBrainz: resolved "${artistName}" to MBID ${mbid}`);

    // Step 2: Get similar artists from ListenBrainz
    const lbRes = await axios.get(
      `https://api.listenbrainz.org/1/lb-radio/artist/${mbid}`,
      {
        params: {
          mode: 'easy',
          max_similar_artists: limit,
          max_recordings_per_artist: 1,
        },
      },
    );

    // ListenBrainz returns a playlist with artist info
    const tracks = lbRes.data?.payload?.jspf?.playlist?.track || [];
    const names = [...new Set(tracks.map(t => t.creator).filter(Boolean))];
    logger.info(`ListenBrainz: ${names.length} similar artists for "${artistName}"`);
    return names;
  } catch (error) {
    logger.warn(`ListenBrainz failed for "${artistName}": ${error.message}`);
    return [];
  }
}

/**
 * Get related artist names using Last.fm (primary) and ListenBrainz (fallback).
 * Returns deduplicated array of artist names.
 */
module.exports = async function getRelatedArtists(artistName) {
  // Run both in parallel — Last.fm is fast, ListenBrainz adds diversity
  const [lastfmNames, lbNames] = await Promise.all([
    fromLastFm(artistName),
    fromListenBrainz(artistName),
  ]);

  // Deduplicate (case-insensitive) preserving Last.fm order first
  const seen = new Set();
  const combined = [];
  for (const name of [...lastfmNames, ...lbNames]) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(name);
    }
  }

  logger.info(`Related artists: ${combined.length} total (${lastfmNames.length} Last.fm + ${lbNames.length} ListenBrainz)`);
  return combined;
};
