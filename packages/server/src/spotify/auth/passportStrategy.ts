import { Strategy as SpotifyStrategy } from 'passport-spotify';
import refresh from 'passport-oauth2-refresh';
import logger from '../../logger';
import { findOrCreateUser } from '../../database/queries/userQueries';
import type { User, SpotifyPhoto } from '../../types';

interface SpotifyProfile {
  id: string;
  displayName: string;
  photos: SpotifyPhoto[];
}

function verify(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  profile: SpotifyProfile,
  done: (err: Error | null, user?: User) => void,
): void {
  findOrCreateUser(profile.id, {
    spotifyAccessToken: accessToken,
    spotifyRefreshToken: refreshToken,
    tokenUpdated: Date.now(),
    expiresIn: expiresIn * 1000,
    displayName: profile.displayName,
    photos: profile.photos,
  })
    .then((user) => {
      logger.info(`Created user ${user.spotifyId}.`);
      done(null, user);
    })
    .catch((err: Error) => done(err));
}

export default function passportStrategy() {
  const { SPOT_CLIENT_ID, SPOT_CLIENT_SECRET, SPOT_REDIRECT_URI } = process.env;

  const spotifyStrategy = new SpotifyStrategy(
    {
      clientID: SPOT_CLIENT_ID as string,
      clientSecret: SPOT_CLIENT_SECRET as string,
      callbackURL: SPOT_REDIRECT_URI as string,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verify as any,
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh.use(spotifyStrategy as any);
  return spotifyStrategy;
}

export { verify };
