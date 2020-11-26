// /////////////////////////
// External dependencies //
// /////////////////////////

const refresh = require('passport-oauth2-refresh');

// /////////////////////////
// Internal dependencies //
// /////////////////////////

const logger = require('../../logger');
const User = require('../../database/schema/User');

function findAndUpdateUser({
  refreshToken,
  accessToken,
  resolve,
  reject,
}) {
  User.findOneAndUpdate({
    spotifyRefreshToken: refreshToken,
  }, {
    $set: {
      spotifyAccessToken: accessToken,
      tokenUpdated: Date.now(),
    },
  }, {
    returnNewDocument: true,
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
