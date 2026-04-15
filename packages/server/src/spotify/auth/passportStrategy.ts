import { Strategy as SpotifyStrategy, type VerifyFunction, type SpotifyProfile } from 'passport-spotify';
import refresh from 'passport-oauth2-refresh';
import logger from '../../logger';
import { findOrCreateUser } from '../../database/queries/userQueries';

const verify: VerifyFunction = (accessToken, refreshToken, expiresIn, profile, done): void => {
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
};

export default function passportStrategy(): SpotifyStrategy {
  const { SPOT_CLIENT_ID = '', SPOT_CLIENT_SECRET = '', SPOT_REDIRECT_URI = '' } = process.env;

  const spotifyStrategy = new SpotifyStrategy(
    {
      clientID: SPOT_CLIENT_ID,
      clientSecret: SPOT_CLIENT_SECRET,
      callbackURL: SPOT_REDIRECT_URI,
    },
    verify,
  );

  refresh.use(spotifyStrategy);
  return spotifyStrategy;
}

export { verify };
