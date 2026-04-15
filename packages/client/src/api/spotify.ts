import axios from 'axios';
import type { UserProfile, PlaybackState, SpotifyAlbum } from '../types';

export async function getAuthUser(): Promise<UserProfile | null> {
  const response = await axios.get<{ user: UserProfile | null }>('/api/auth/user');
  return response.data.user || null;
}

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
