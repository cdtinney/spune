import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import { artistIdCache, normalizeKey, NOT_FOUND } from '../../../cache';

/**
 * Search Spotify for an artist by name and return their ID.
 * Results are cached by normalized artist name.
 */
export default async function resolveArtistId(
  spotifyApi: SpotifyApi,
  name: string,
): Promise<string | null> {
  const cacheKey = normalizeKey(name);
  const cached = artistIdCache.get(cacheKey);
  if (cached !== undefined) {
    return cached === NOT_FOUND ? null : cached;
  }

  try {
    const results = await spotifyApi.search(name, ['artist'], undefined, 1);
    const id = results.artists?.items?.[0]?.id || null;
    artistIdCache.set(cacheKey, id ?? NOT_FOUND);
    return id;
  } catch {
    return null;
  }
}
