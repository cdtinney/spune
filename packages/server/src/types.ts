export interface User {
  id: number;
  spotifyId: string;
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  tokenUpdated: number;
  expiresIn: number;
  displayName: string;
  photos: SpotifyPhoto[];
}

export interface SpotifyPhoto {
  value: string;
}

export interface UserRow {
  id: number;
  spotify_id: string;
  spotify_access_token: string;
  spotify_refresh_token: string;
  token_updated: number;
  expires_in: number;
  display_name: string;
  photos: SpotifyPhoto[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  album_type: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
  release_date: string;
  total_tracks: number;
  uri: string;
  external_urls: { spotify: string };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri?: string;
  external_urls?: { spotify: string };
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface ArtistAlbumsResult {
  artistId: string;
  albums: SpotifyAlbum[];
}

export interface LastFmSimilarArtist {
  name: string;
  match: string;
  url: string;
}

export interface LastFmResponse {
  similarartists?: {
    artist?: LastFmSimilarArtist[];
  };
}

export interface ListenBrainzTrack {
  creator?: string;
  title?: string;
}

export interface ListenBrainzResponse {
  payload?: {
    jspf?: {
      playlist?: {
        track?: ListenBrainzTrack[];
      };
    };
  };
}

export interface MusicBrainzArtist {
  id?: string;
  name?: string;
}

export interface MusicBrainzResponse {
  artists?: MusicBrainzArtist[];
}
