// Shared types for Cast sender/receiver messaging

export const CAST_NAMESPACE = 'urn:x-cast:com.spune.visualization';

export interface CastNowPlaying {
  songId: string;
  songTitle: string;
  artistName: string;
  albumName: string;
  albumImageUrl: string | undefined;
  progressMs: number;
  durationMs: number;
  isPlaying: boolean;
}

export interface CastMessage {
  type: 'UPDATE_PLAYBACK';
  nowPlaying: CastNowPlaying;
  albumImageUrls: string[];
}
