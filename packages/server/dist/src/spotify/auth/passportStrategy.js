'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = passportStrategy;
exports.verify = verify;
const passport_spotify_1 = require('passport-spotify');
const passport_oauth2_refresh_1 = __importDefault(require('passport-oauth2-refresh'));
const logger_1 = __importDefault(require('../../logger'));
const userQueries_1 = require('../../database/queries/userQueries');
function verify(accessToken, refreshToken, expiresIn, profile, done) {
  (0, userQueries_1.findOrCreateUser)(profile.id, {
    spotifyAccessToken: accessToken,
    spotifyRefreshToken: refreshToken,
    tokenUpdated: Date.now(),
    expiresIn: expiresIn * 1000,
    displayName: profile.displayName,
    photos: profile.photos,
  })
    .then((user) => {
      logger_1.default.info(`Created user ${user.spotifyId}.`);
      done(null, user);
    })
    .catch((err) => done(err));
}
function passportStrategy() {
  const { SPOT_CLIENT_ID, SPOT_CLIENT_SECRET, SPOT_REDIRECT_URI } = process.env;
  const spotifyStrategy = new passport_spotify_1.Strategy(
    {
      clientID: SPOT_CLIENT_ID,
      clientSecret: SPOT_CLIENT_SECRET,
      callbackURL: SPOT_REDIRECT_URI,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    verify,
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  passport_oauth2_refresh_1.default.use(spotifyStrategy);
  return spotifyStrategy;
}
//# sourceMappingURL=passportStrategy.js.map
