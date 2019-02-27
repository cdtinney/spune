const passport = require('passport');
const paths = require('../config/paths');

function authUser(req, res) {
  if (!req.user) {
    res.json({});
    return;
  }
  
  // TODO Need to find User
  res.json({
    user: req.user,
  });
}

function authSpotify() {
  passport.authenticate('spotify', {
    scope: [
      'user-read-private',
      'user-read-email',
      // Required for getting user's current playback info.
      'user-read-playback-state',
    ],
  });
}

function authSpotifyCallback() {
  passport.authenticate('spotify', {
    successRedirect: paths.clientHome,
    failureRedirect: paths.clientLogin,
  });
}

module.exports = function initRoutes(router) {
  router.get('/auth/user', authUser);
  // This route will redirect to Spotify so nothing needs to be done other than
  // calling `passport.authenticate()`.
  router.get('/auth/spotify', authSpotify, () => {});
  router.get('/auth/spotify/callback', authSpotifyCallback);
};

module.exports.authUser = authUser;
module.exports.authSpotify = authSpotify;
module.exports.authSpotifyCallback = authSpotifyCallback;
