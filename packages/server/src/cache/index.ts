import { LRUCache } from 'lru-cache';
import type { ArtistAlbumsResult } from '../types';

const ONE_HOUR_MS = 60 * 60 * 1000;
const THIRTY_MIN_MS = 30 * 60 * 1000;

/** Sentinel value representing a cached "not found" result. */
export const NOT_FOUND = Symbol('NOT_FOUND');

export type ArtistIdCacheValue = string | typeof NOT_FOUND;

/** Related artist names by primary artist name (case-insensitive key). */
export const relatedArtistsCache = new LRUCache<string, string[]>({
  max: 200,
  ttl: ONE_HOUR_MS,
});

/** Spotify artist ID by artist name (case-insensitive key). Uses NOT_FOUND for null results. */
export const artistIdCache = new LRUCache<string, ArtistIdCacheValue>({
  max: 500,
  ttl: ONE_HOUR_MS,
});

/** Artist albums by Spotify artist ID. */
export const artistAlbumsCache = new LRUCache<string, ArtistAlbumsResult>({
  max: 500,
  ttl: THIRTY_MIN_MS,
});

export function normalizeKey(name: string): string {
  return String(name).toLowerCase().trim();
}
