import { Strategy as SpotifyStrategy, type VerifyFunction } from 'passport-spotify';
import refresh from 'passport-oauth2-refresh';
import logger from '../../logger';
import { findOrCreateUser } from '../../database/queries/userQueries';
import type { SpotifyPhoto } from '../../types';

interface SpotifyProfile {
  id: string;
  displayName: string;
  photos: SpotifyPhoto[];
}

const verify: VerifyFunction = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
  profile,
  done,
): void => {
  const { id, displayName, photos } = profile as SpotifyProfile;
  findOrCreateUser(id, {
    spotifyAccessToken: accessToken,
    spotifyRefreshToken: refreshToken,
    tokenUpdated: Date.now(),
    expiresIn: expiresIn * 1000,
    displayName,
    photos,
  })
    .then((user) => {
      logger.info(`Created user ${user.spotifyId}.`);
      done(null, user);
    })
    .catch((err: Error) => done(err));
};

export default function passportStrategy(): SpotifyStrategy {
  const { SPOT_CLIENT_ID, SPOT_CLIENT_SECRET, SPOT_REDIRECT_URI } = process.env;

  const spotifyStrategy = new SpotifyStrategy(
    {
      clientID: SPOT_CLIENT_ID as string,
      clientSecret: SPOT_CLIENT_SECRET as string,
      callbackURL: SPOT_REDIRECT_URI as string,
    },
    verify,
  );

  refresh.use(spotifyStrategy);
  return spotifyStrategy;
}

export { verify };
