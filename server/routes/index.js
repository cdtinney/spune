const express = require('express');
const passport = require('passport');

const paths = require('../config/paths');

const spotify = require('./spotify');

const router = new express.Router();

// Authorization

router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-private',
      'user-read-email',
      // Required for getting user's current playback info.
      'user-read-playback-state',
    ],
    showDialog: true,
  }),
  function() {
    // The request will be redirected to Spotify for authentication, so this
    // function will not be called.
  },
);

router.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', {
    successRedirect: paths.clientHome,
    failureRedirect: paths.clientLogin,
  }),
);

// Spotify

router.get('/spotify/me', spotify.me);
router.get('/spotify/me/player', spotify.mePlayer);
router.get('/spotify/currently-playing/related-albums', spotify.currentlyPlayingRelatedAlbums);

module.exports = router;