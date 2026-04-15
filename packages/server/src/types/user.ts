export interface SpotifyPhoto {
  value: string;
}

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
