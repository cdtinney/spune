import { Strategy as SpotifyStrategy } from 'passport-spotify';
import type { User, SpotifyPhoto } from '../../types';
interface SpotifyProfile {
  id: string;
  displayName: string;
  photos: SpotifyPhoto[];
}
declare function verify(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  profile: SpotifyProfile,
  done: (err: Error | null, user?: User) => void,
): void;
export default function passportStrategy(): SpotifyStrategy;
export { verify };
