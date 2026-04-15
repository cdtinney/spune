'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const passport_1 = __importDefault(require('passport'));
const paths_1 = __importDefault(require('../config/paths'));
const SPOTIFY_PERMISSION_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-playback-state',
];
const router = (0, express_1.Router)();
router.get('/user', (req, res) => {
  const user = req.user;
  if (!user) {
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
router.get('/user/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    // Setting to `null` will clear the session in the DB.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.session = null;
    res.redirect('/');
  });
});
router.get(
  '/spotify',
  passport_1.default.authenticate('spotify', {
    scope: SPOTIFY_PERMISSION_SCOPES,
  }),
  () => {
    // This route will redirect to Spotify so nothing needs to be done other than
    // calling `passport.authenticate()`.
  },
);
router.get(
  '/spotify/callback',
  passport_1.default.authenticate('spotify', {
    successRedirect: paths_1.default.clientHome,
    failureRedirect: paths_1.default.clientLogin,
  }),
);
exports.default = router;
//# sourceMappingURL=auth.js.map
