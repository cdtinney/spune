const router = require('express').Router();
const passport = require('passport');
const paths = require('../config/paths');

const SPOTIFY_PERMISSION_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];

router.get('/user', function authUser(req, res) {
  if (!req.user) {
    res.json({});
    return;
  }
  
  // TODO Need to find User
  res.json({
    user: req.user,
  });
});

router.get('/spotify', function authSpotify(req, res) {
  passport.authenticate('spotify', {
    scope: SPOTIFY_PERMISSION_SCOPES,
  });
  res.end();
});

// This route will redirect to Spotify so nothing needs to be done other than
// calling `passport.authenticate()`.
router.get('/spotify/callback', function authSpotifyCallback(req, res) {
  passport.authenticate('spotify', {
    successRedirect: paths.clientHome,
    failureRedirect: paths.clientLogin,
  });
  res.end();
});

module.exports = router;
