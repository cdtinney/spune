const refresh = require('passport-oauth2-refresh');
const logger = require('../../logger');
const { updateUserByRefreshToken } = require('../../database/queries/userQueries');

function findAndUpdateUser({ refreshToken, accessToken }) {
  return updateUserByRefreshToken(refreshToken, {
    spotifyAccessToken: accessToken,
    tokenUpdated: Date.now(),
  }).then((user) => {
    logger.info(`Refreshed access token for user '${user.spotifyId}'`);
    return user;
  });
}

module.exports = function refreshToken(currRefreshToken) {
  return new Promise((resolve, reject) => {
    refresh.requestNewAccessToken(
      'spotify',
      currRefreshToken,
      (err, accessToken) => {
        if (err) {
          reject(err);
          return;
        }

        findAndUpdateUser({
          refreshToken: currRefreshToken,
          accessToken,
        }).then(resolve).catch(reject);
      },
    );
  });
};
