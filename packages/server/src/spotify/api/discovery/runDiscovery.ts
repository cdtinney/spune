import logger from '../../../logger';
import type { SpotifyAlbum } from '../../../types';
import type { DiscoveryContext, DiscoverySource } from './types';

/**
 * Run all discovery sources in parallel, sort results by priority,
 * and return a flat array of albums in priority order.
 */
export default async function runDiscovery(
  sources: DiscoverySource[],
  context: DiscoveryContext,
): Promise<SpotifyAlbum[]> {
  const results = await Promise.all(
    sources.map(async (source) => {
      try {
        const albums = await source.discover(context);
        logger.info(`Discovery source "${source.name}": ${albums.length} albums`);
        return { priority: source.priority, albums };
      } catch {
        logger.warn(`Discovery source "${source.name}" failed`);
        return { priority: source.priority, albums: [] as SpotifyAlbum[] };
      }
    }),
  );

  return results.sort((a, b) => a.priority - b.priority).flatMap((r) => r.albums);
}
