import axios from 'axios';
import type { PlaybackState, SpotifyAlbum } from '../../types';

export async function getPlaybackState(): Promise<PlaybackState> {
  const response = await axios.get<PlaybackState>('/api/spotify/me/player');
  return response.data;
}

export async function getRelatedAlbums(songId: string): Promise<SpotifyAlbum[]> {
  const response = await axios.get<SpotifyAlbum[]>(
    '/api/spotify/currently-playing/related-albums',
    {
      params: { songId },
    },
  );
  return response.data;
}
