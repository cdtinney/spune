import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import getArtistAlbums from './getArtistAlbums';
import getRelatedArtists from './getRelatedArtists';
import uniqueAlbums from '../../utils/uniqueAlbums';
import combineTrackArtists from '../../utils/combineTrackArtists';
import logger from '../../../logger';
import { artistIdCache, normalizeKey, NOT_FOUND } from '../../../cache';
import type { SpotifyAlbum, SpotifyArtist } from '../../../types';

interface CurrentlyPlayingItem {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    artists: SpotifyArtist[];
  };
}

interface CurrentlyPlayingResponse {
  item: CurrentlyPlayingItem;
}

/**
 * Search Spotify for an artist by name and return their ID.
 * Results are cached by normalized artist name.
 */
async function resolveArtistId(spotifyApi: SpotifyApi, name: string): Promise<string | null> {
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

export default async function getCurrentlyPlayingRelatedAlbums(
  spotifyApi: SpotifyApi,
  songId: string,
): Promise<SpotifyAlbum[]> {
  const response =
    (await spotifyApi.player.getCurrentlyPlayingTrack()) as unknown as CurrentlyPlayingResponse;
  const {
    item: {
      id,
      artists: songArtists,
      album: { artists: albumArtists },
    },
  } = response;

  logger.info(
    `Currently playing: "${response.item.name}" by ${songArtists.map((a) => a.name).join(', ')} (songId=${id})`,
  );

  if (songId !== id) {
    return Promise.reject(
      new Error(`Song ID mismatch (currently playing = ${id}, query = ${songId})`),
    );
  }

  const trackArtistIds = combineTrackArtists({ songArtists, albumArtists });
  const primaryArtistName = songArtists[0]?.name;

  // 1. Fetch track artists' own albums (always included, first priority)
  const artistAlbumResults = await Promise.all(
    trackArtistIds.map((artistId) => getArtistAlbums(spotifyApi, artistId)),
  );
  const artistAlbums = artistAlbumResults.reduce<SpotifyAlbum[]>(
    (arr, curr) => arr.concat(curr.albums),
    [],
  );
  logger.info(`Artist albums: ${artistAlbums.length} from ${trackArtistIds.length} artist(s)`);

  // 2. Get related artist names from Last.fm + ListenBrainz
  const relatedNames = await getRelatedArtists(primaryArtistName);

  // 3. Resolve related artist names to Spotify IDs and fetch their albums
  // Process in batches of 5 to avoid hammering the API
  const relatedAlbums: SpotifyAlbum[] = [];
  const trackArtistIdSet = new Set(trackArtistIds);

  for (let i = 0; i < relatedNames.length && relatedAlbums.length < 200; i += 5) {
    const batch = relatedNames.slice(i, i + 5);
    const ids = await Promise.all(batch.map((name) => resolveArtistId(spotifyApi, name)));

    const validIds = ids.filter(
      (resolvedId): resolvedId is string =>
        resolvedId !== null && !trackArtistIdSet.has(resolvedId),
    );
    const albumResults = await Promise.all(
      validIds.map((resolvedId) => getArtistAlbums(spotifyApi, resolvedId)),
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
}
