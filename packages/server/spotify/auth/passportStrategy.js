////////////////////////////
// External dependencies  //
////////////////////////////

const SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');

////////////////////////////
// Internal dependencies  //
////////////////////////////

const User = require('../../database/schema/User');

function verify(accessToken, refreshToken, expires_in, profile, done) {
  User.findOrCreate({
    // Used to find the document -- if it exists.
    spotifyId: profile.id,
  }, {
    // These properties will be added/updated if it exists or not.
    spotifyAccessToken: accessToken,
    spotifyRefreshToken: refreshToken,
    tokenUpdated: Date.now(),
    expiresIn: expires_in,
    displayName: profile.displayName,
    photos: profile.photos,
  }, function(err, user) {
    console.log(`Created user ${user.spotifyId}.`);
    return done(err, user);
  });
}

module.exports = function passportStrategy() {
  const {
    SPOT_CLIENT_ID,
    SPOT_CLIENT_SECRET,
    SPOT_REDIRECT_URI,
  } = process.env;

  const spotifyStrategy =
    new SpotifyStrategy({
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