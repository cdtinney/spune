// /////////////////////////
// Internal dependencies  //
// /////////////////////////

const Database = require('../../database');

module.exports = async function deserializeUser(spotifyId, done) {
  await Database.getInstance().Models.User.findOne({
    spotifyId,
  }, (err, user) => {
    done(err, user);
  });
};
