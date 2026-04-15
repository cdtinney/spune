import refresh from 'passport-oauth2-refresh';
import logger from '../../logger';
import { updateUserByRefreshToken } from '../../database/queries/userQueries';
import type { User } from '../../types';

function findAndUpdateUser({
  refreshToken,
  accessToken,
}: {
  refreshToken: string;
  accessToken: string;
}): Promise<User> {
  return updateUserByRefreshToken(refreshToken, {
    spotifyAccessToken: accessToken,
    tokenUpdated: Date.now(),
  }).then((user) => {
    if (!user) {
      throw new Error(`No user found for refresh token`);
    }
    logger.info(`Refreshed access token for user '${user.spotifyId}'`);
    return user;
  });
}

export default function refreshToken(currRefreshToken: string): Promise<User> {
  return new Promise((resolve, reject) => {
    refresh.requestNewAccessToken(
      'spotify',
      currRefreshToken,
      (err: Error | null, accessToken: string) => {
        if (err) {
          reject(err);
          return;
        }

        findAndUpdateUser({
          refreshToken: currRefreshToken,
          accessToken,
        })
          .then(resolve)
          .catch(reject);
      },
    );
  });
}
