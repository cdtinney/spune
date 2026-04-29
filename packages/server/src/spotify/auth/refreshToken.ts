import refresh from 'passport-oauth2-refresh';
import logger from '../../logger';
import { updateUserAccessTokenBySpotifyId } from '../../database/queries/userQueries';
import type { User } from '../../types';

function findAndUpdateUser({
  spotifyId,
  accessToken,
}: {
  spotifyId: string;
  accessToken: string;
}): Promise<User> {
  return updateUserAccessTokenBySpotifyId(spotifyId, {
    spotifyAccessToken: accessToken,
    tokenUpdated: Date.now(),
  }).then((user) => {
    if (!user) {
      throw new Error(`No user found for spotifyId '${spotifyId}'`);
    }
    logger.info(`Refreshed access token for user '${user.spotifyId}'`);
    return user;
  });
}

export default function refreshToken(spotifyId: string, currRefreshToken: string): Promise<User> {
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
          spotifyId,
          accessToken,
        })
          .then(resolve)
          .catch(reject);
      },
    );
  });
}
