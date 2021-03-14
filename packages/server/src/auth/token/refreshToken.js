// /////////////////////////
// External dependencies //
// /////////////////////////

const refresh = require('passport-oauth2-refresh');

// /////////////////////////
// Internal dependencies //
// /////////////////////////

const logger = require('../../logger');
const Database = require('../../database');

function findAndUpdateUser({
  refreshToken,
  accessToken,
  resolve,
  reject,
}) {
  Database.getInstance().Models.User.findOneAndUpdate(refreshToken, {
    spotifyAccessToken: accessToken,
    tokenUpdated: Date.now(),
  }, (err, user) => {
    if (err) {
      reject(err);
      return;
    }

    logger.info(`Refreshed access token for user '${user.spotifyId}'`);
    resolve(user);
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
          resolve,
          reject,
        });
      },
    );
  });
};
