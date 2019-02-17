const express = require('express');

const auth = require('./auth');
const spotify = require('./spotify');

const router = new express.Router();

// Authorization

router.get('/login', auth.login);
router.get('/callback', auth.callback);

// Spotify
router.get('/currently-playing/related-albums', spotify.currentlyPlayingRelatedAlbums);

module.exports = router;