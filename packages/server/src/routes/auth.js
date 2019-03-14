const router = require('express').Router();
const passport = require('passport');
const paths = require('../config/paths');

const SPOTIFY_PERMISSION_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];

router.get('/user', (req, res) => {
  const { user } = req;
  if (!req.user) {
    res.json({});
    return;
  }

  res.json({
    user: {
      spotifyId: user.spotifyId,
      displayName: user.displayName,
      photos: user.photos,
    },
  });
});

router.get('/user/logout', (req, res) => {
  req.logout();
  // Setting to `null` will clear the session in the DB.
  req.session = null;
  res.redirect('/');
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
