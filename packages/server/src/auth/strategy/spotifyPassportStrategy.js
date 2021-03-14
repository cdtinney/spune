// //////////////////////////
// External dependencies  //
// //////////////////////////

const SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');

// //////////////////////////
// Internal dependencies  //
// //////////////////////////

const logger = require('../../logger');
const Database = require('../../database');

function verify(accessToken, refreshToken, expiresIn, profile, done) {
  Database.getInstance().Models.User.upsert(profile.id, {
    // These properties will be added/updated if it exists or not.
    spotifyAccessToken: accessToken,
    spotifyRefreshToken: refreshToken,
    tokenUpdated: Date.now(),
    expiresIn: expiresIn * 1000, // Convert to MS.
    displayName: profile.displayName,
    photos: profile.photos,
  }, (err, user) => {
    logger.info(`Created user ${user.spotifyId}.`);
    return done(err, user);
  });
}

module.exports = function spotifyPassportStrategy() {
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

  // Adds a plugin to enable simple token swapping.
  refresh.use(spotifyStrategy);
  return spotifyStrategy;
};

module.exports.verify = verify;
