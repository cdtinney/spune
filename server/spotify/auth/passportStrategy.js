const SpotifyStrategy = require('passport-spotify').Strategy;

const User = require('../../database/schema/User');

// Unpack environemnt variables needed for auth.
const {
  SPOT_CLIENT_ID,
  SPOT_CLIENT_SECRET,
  SPOT_REDIRECT_URI,
} = process.env;

module.exports = function passportStrategy() {
  return new SpotifyStrategy({
      clientID: SPOT_CLIENT_ID,
      clientSecret: SPOT_CLIENT_SECRET,
      callbackURL: SPOT_REDIRECT_URI,
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      User.findOrCreate({
        spotifyId: profile.id,
        spotifyAccessToken: accessToken,
        spotifyRefreshToken: refreshToken,
      }, function(err, user) {
        return done(err, user);
      });
    },
  );
};
