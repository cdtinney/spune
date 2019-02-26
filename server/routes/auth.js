const passport = require('passport');
const paths = require('../config/paths');

module.exports = function initRoutes(router) {
  router.get(
    '/auth',
    function(req, res) {
      if (!req.user) {
        res.json({});
        return;
      }

      // TODO Need to find User
      res.json({
        user: req.user,
      });
    },
  );

  router.get(
    '/auth/spotify',
    passport.authenticate('spotify', {
      scope: [
        'user-read-private',
        'user-read-email',
        // Required for getting user's current playback info.
        'user-read-playback-state',
      ],
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
};
