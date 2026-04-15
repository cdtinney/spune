// Shared types for the Spune client application

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

export interface WindowSize {
  width: number;
  height: number;
}

export interface Album {
  id: string;
  title: string;
  imageUrl: string | undefined;
  span: number;
  col: number;
  row: number;
}

export interface AlbumGridResult {
  tiles: Album[];
  gridCols: number;
  gridRows: number;
  base: number;
}

export interface UserProfile {
  spotifyId: string;
  displayName?: string;
  photos?: Array<string | { url?: string; value?: string }>;
}
