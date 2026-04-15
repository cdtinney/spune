'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = refreshToken;
const passport_oauth2_refresh_1 = __importDefault(require('passport-oauth2-refresh'));
const logger_1 = __importDefault(require('../../logger'));
const userQueries_1 = require('../../database/queries/userQueries');
function findAndUpdateUser({ refreshToken, accessToken }) {
  return (0, userQueries_1.updateUserByRefreshToken)(refreshToken, {
    spotifyAccessToken: accessToken,
    tokenUpdated: Date.now(),
  }).then((user) => {
    if (!user) {
      throw new Error(`No user found for refresh token`);
    }
    logger_1.default.info(`Refreshed access token for user '${user.spotifyId}'`);
    return user;
  });
}
function refreshToken(currRefreshToken) {
  return new Promise((resolve, reject) => {
    passport_oauth2_refresh_1.default.requestNewAccessToken(
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
        })
          .then(resolve)
          .catch(reject);
      },
    );
  });
}
//# sourceMappingURL=refreshToken.js.map
