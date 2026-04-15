import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { ArtistAlbumsResult } from '../../../types';
export default function getArtistAlbums(
  spotifyApi: SpotifyApi,
  artistId: string,
): Promise<ArtistAlbumsResult>;
