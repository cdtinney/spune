import type { User, SpotifyPhoto } from '../../types';
interface FindOrCreateUserData {
  spotifyAccessToken: string;
  spotifyRefreshToken: string;
  tokenUpdated: number;
  expiresIn: number;
  displayName: string;
  photos: SpotifyPhoto[];
}
interface UpdateUserData {
  spotifyAccessToken: string;
  tokenUpdated: number;
}
declare function findOrCreateUser(spotifyId: string, data: FindOrCreateUserData): Promise<User>;
declare function findUserBySpotifyId(spotifyId: string): Promise<User | null>;
declare function updateUserByRefreshToken(
  refreshToken: string,
  data: UpdateUserData,
): Promise<User | null>;
export { findOrCreateUser, findUserBySpotifyId, updateUserByRefreshToken };
