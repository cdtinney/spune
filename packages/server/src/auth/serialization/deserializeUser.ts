import { findUserBySpotifyId } from '../../database/queries/userQueries';
import type { User } from '../../types';

export default function deserializeUser(
  spotifyId: string,
  done: (err: Error | null, user?: User | null) => void,
): void {
  findUserBySpotifyId(spotifyId)
    .then((user) => done(null, user))
    .catch((err: Error) => done(err));
}
