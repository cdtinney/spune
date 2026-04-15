import axios from 'axios';
import logger from '../../../logger';
import { relatedArtistsCache, normalizeKey } from '../../../cache';
import errorMessage from '../../../utils/errorMessage';
import type { LastFmResponse, ListenBrainzResponse, MusicBrainzResponse } from '../../../types';

const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0/';

/**
 * Get similar artists via Last.fm's artist.getSimilar endpoint.
 * Returns an array of artist names ranked by similarity.
 */
async function fromLastFm(artistName: string, limit = 30): Promise<string[]> {
  const apiKey = process.env.LAST_FM_API_KEY;
  if (!apiKey) {
    logger.warn('LAST_FM_API_KEY not set, skipping Last.fm');
    return [];
  }

  try {
    const { data } = await axios.get<LastFmResponse>(LASTFM_BASE, {
      params: {
        method: 'artist.getSimilar',
        artist: artistName,
        api_key: apiKey,
        format: 'json',
        limit,
      },
    });

    const artists = data?.similarartists?.artist || [];
    const names = artists.map((a) => a.name);
    logger.info(`Last.fm: ${names.length} similar artists for "${artistName}"`);
    return names;
  } catch (error) {
    const message = errorMessage(error);
    logger.warn(`Last.fm failed for "${artistName}": ${message}`);
    return [];
  }
}

/**
 * Get similar artists via ListenBrainz.
 * Requires resolving the artist name to a MusicBrainz ID first.
 */
async function fromListenBrainz(artistName: string, limit = 20): Promise<string[]> {
  try {
    // Step 1: Resolve artist name to MusicBrainz ID
    const mbRes = await axios.get<MusicBrainzResponse>('https://musicbrainz.org/ws/2/artist/', {
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
    const lbRes = await axios.get<ListenBrainzResponse>(
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
    const names = [...new Set(tracks.map((t) => t.creator).filter((c): c is string => Boolean(c)))];
    logger.info(`ListenBrainz: ${names.length} similar artists for "${artistName}"`);
    return names;
  } catch (error) {
    const message = errorMessage(error);
    logger.warn(`ListenBrainz failed for "${artistName}": ${message}`);
    return [];
  }
}

/**
 * Get related artist names using Last.fm (primary) and ListenBrainz (fallback).
 * Returns deduplicated array of artist names.
 */
export default async function getRelatedArtists(artistName: string): Promise<string[]> {
  const cacheKey = normalizeKey(artistName);
  const cached = relatedArtistsCache.get(cacheKey);
  if (cached) {
    logger.info(`Related artists cache hit for "${artistName}" (${cached.length} artists)`);
    return cached;
  }

  // Run both in parallel -- Last.fm is fast, ListenBrainz adds diversity
  const [lastfmNames, lbNames] = await Promise.all([
    fromLastFm(artistName),
    fromListenBrainz(artistName),
  ]);

  // Deduplicate (case-insensitive) preserving Last.fm order first
  const seen = new Set<string>();
  const combined: string[] = [];
  for (const name of [...lastfmNames, ...lbNames]) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(name);
    }
  }

  logger.info(
    `Related artists: ${combined.length} total (${lastfmNames.length} Last.fm + ${lbNames.length} ListenBrainz)`,
  );

  if (combined.length > 0) {
    relatedArtistsCache.set(cacheKey, combined);
  }
  return combined;
}
