const SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');
const logger = require('../../logger');
const { findOrCreateUser } = require('../../database/queries/userQueries');

function verify(accessToken, refreshToken, expiresIn, profile, done) {
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
    .catch((err) => done(err));
}

module.exports = function passportStrategy() {
  const {
    SPOT_CLIENT_ID,
    SPOT_CLIENT_SECRET,
    SPOT_REDIRECT_URI,
  } = process.env;

  const spotifyStrategy = new SpotifyStrategy({
    clientID: SPOT_CLIENT_ID,
    clientSecret: SPOT_CLIENT_SECRET,
    callbackURL: SPOT_REDIRECT_URI,
  },
  verify);

  refresh.use(spotifyStrategy);
  return spotifyStrategy;
};

module.exports.verify = verify;
