import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import uniqueAlbums from '../../utils/uniqueAlbums';
import type { SpotifyAlbum, ArtistAlbumsResult } from '../../../types';

export default async function getArtistAlbums(
  spotifyApi: SpotifyApi,
  artistId: string,
): Promise<ArtistAlbumsResult> {
  const data = await spotifyApi.artists.albums(artistId, 'album,compilation', undefined, 50);

  return {
    artistId,
    albums: uniqueAlbums(data.items as unknown as SpotifyAlbum[]),
  };
}
