import type { User } from '../../types';
export default function deserializeUser(
  spotifyId: string,
  done: (err: Error | null, user?: User | null) => void,
): void;
