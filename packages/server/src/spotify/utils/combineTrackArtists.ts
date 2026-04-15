import type { SpotifyArtist } from '../../types';

interface CombineTrackArtistsArgs {
  songArtists: SpotifyArtist[];
  albumArtists: SpotifyArtist[];
}

export default function combineTrackArtists({
  songArtists,
  albumArtists,
}: CombineTrackArtistsArgs): string[] {
  const artistIds = songArtists.concat(albumArtists).map((artist) => artist.id);

  // Use Set to filter for uniqueness
  return [...new Set(artistIds)];
}
