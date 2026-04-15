export interface SpotifyImage {
  url: string;
  height?: number;
  width?: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri?: string;
  href?: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  uri?: string;
  href?: string;
  release_date?: string;
  album_type?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  uri?: string;
  href?: string;
}

export interface PlaybackState {
  item: SpotifyTrack | null;
  is_playing?: boolean;
  progress_ms?: number;
}

export interface NowPlaying {
  songId: string;
  songTitle: string;
  songArtists: SpotifyArtist[];
  artistName: string;
  albumId: string;
  albumName: string;
  albumImageUrl: string | undefined;
  albumArtists: SpotifyArtist[];
  albumImages: SpotifyImage[];
}

export interface RelatedAlbums {
  byAlbumId: Record<string, SpotifyAlbum>;
  allAlbumIds: string[];
}
