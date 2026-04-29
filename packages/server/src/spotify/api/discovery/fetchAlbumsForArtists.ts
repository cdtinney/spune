import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import getArtistAlbums from '../helpers/getArtistAlbums';
import resolveArtistId from '../helpers/resolveArtistId';
import type { SpotifyAlbum } from '../../../types';

const BATCH_SIZE = 5;

/**
 * Resolve artist names to Spotify IDs and fetch their albums in batches.
 * Skips names that resolve to null or to an ID in the exclude set.
 * Stops early once `maxAlbums` is reached.
 */
export async function fetchAlbumsForNames(
  spotifyApi: SpotifyApi,
  names: string[],
  excludeIds: Set<string>,
  maxAlbums: number,
): Promise<SpotifyAlbum[]> {
  const albums: SpotifyAlbum[] = [];

  for (let i = 0; i < names.length && albums.length < maxAlbums; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE);
    const ids = await Promise.all(batch.map((name) => resolveArtistId(spotifyApi, name)));

    const validIds = ids.filter((id): id is string => id !== null && !excludeIds.has(id));

    const results = await Promise.all(validIds.map((id) => getArtistAlbums(spotifyApi, id)));

    for (const result of results) {
      albums.push(...result.albums);
    }
  }

  return albums;
}

/**
 * Fetch albums for a list of already-resolved artist IDs in batches.
 * Stops early once `maxAlbums` is reached.
 */
export async function fetchAlbumsForIds(
  spotifyApi: SpotifyApi,
  ids: string[],
  maxAlbums: number,
): Promise<SpotifyAlbum[]> {
  const albums: SpotifyAlbum[] = [];

  for (let i = 0; i < ids.length && albums.length < maxAlbums; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((id) => getArtistAlbums(spotifyApi, id)));

    for (const result of results) {
      albums.push(...result.albums);
    }
  }

  return albums;
}
