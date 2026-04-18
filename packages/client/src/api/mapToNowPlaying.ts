import type { NowPlaying, SpotifyTrack } from '../types';

export default function mapToNowPlaying(
  item: SpotifyTrack,
  progressMs: number,
  isPlaying: boolean,
): NowPlaying {
  return {
    songId: item.id,
    songTitle: item.name,
    songArtists: item.artists,
    artistName: item.artists.map((a) => a.name).join(', '),
    albumId: item.album.id,
    albumName: item.album.name,
    albumImageUrl: item.album.images[0]?.url,
    albumArtists: item.album.artists,
    albumImages: item.album.images,
    progressMs,
    durationMs: item.duration_ms ?? 0,
    isPlaying,
  };
}
