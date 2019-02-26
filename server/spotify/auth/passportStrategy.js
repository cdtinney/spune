const SpotifyStrategy = require('passport-spotify').Strategy;
const refresh = require('passport-oauth2-refresh');

const User = require('../../database/schema/User');

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
    function(accessToken, refreshToken, expires_in, profile, done) {
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
    });

  // Adds a plugin to enable simple token swapping.
  refresh.use(spotifyStrategy);
  return spotifyStrategy;
};
