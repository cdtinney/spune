////////////////////////////
// Internal dependencies  //
////////////////////////////

const User = require('../../database/schema/User');

module.exports = function deserializeUser(spotifyId, done) {
  User.findOne({
    spotifyId,
  }, function(err, user) {
    done(err, user);
  });
};
