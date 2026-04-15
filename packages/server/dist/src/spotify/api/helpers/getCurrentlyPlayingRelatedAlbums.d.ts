import type { SpotifyApi } from '@spotify/web-api-ts-sdk';
import type { SpotifyAlbum } from '../../../types';
export default function getCurrentlyPlayingRelatedAlbums(
  spotifyApi: SpotifyApi,
  songId: string,
): Promise<SpotifyAlbum[]>;
