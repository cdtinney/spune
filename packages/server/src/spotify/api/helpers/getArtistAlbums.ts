import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import uniqueAlbums from '../../utils/uniqueAlbums';
import logger from '../../../logger';
import { artistAlbumsCache } from '../../../cache';
import type { SpotifyAlbum, ArtistAlbumsResult } from '../../../types';

export default async function getArtistAlbums(
  spotifyApi: SpotifyApi,
  artistId: string,
): Promise<ArtistAlbumsResult> {
  const cached = artistAlbumsCache.get(artistId);
  if (cached) {
    logger.info(`Artist albums cache hit for ${artistId}`);
    return cached;
  }

  const data = await spotifyApi.artists.albums(artistId, 'album,compilation', undefined, 50);

  const result: ArtistAlbumsResult = {
    artistId,
    albums: uniqueAlbums(data.items as unknown as SpotifyAlbum[]),
  };

  artistAlbumsCache.set(artistId, result);
  return result;
}
