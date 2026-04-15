import type { SpotifyArtist } from '../../types';
interface CombineTrackArtistsArgs {
  songArtists: SpotifyArtist[];
  albumArtists: SpotifyArtist[];
}
export default function combineTrackArtists({
  songArtists,
  albumArtists,
}: CombineTrackArtistsArgs): string[];
export {};
