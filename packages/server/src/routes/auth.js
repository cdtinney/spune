const router = require('express').Router();
const passport = require('passport');
const paths = require('../config/paths');

const SPOTIFY_PERMISSION_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];

router.get('/user', (req, res) => {
  if (!req.user) {
    res.json({});
    return;
  }

  // TODO Need to find User
  res.json({
    user: req.user,
  });
});

router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: SPOTIFY_PERMISSION_SCOPES,
  }), () => {
    // This route will redirect to Spotify so nothing needs to be done other than
    // calling `passport.authenticate()`.
  },
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', {
    successRedirect: paths.clientHome,
    failureRedirect: paths.clientLogin,
  }),
);

module.exports = router;
