const { findUserBySpotifyId } = require('../../database/queries/userQueries');

module.exports = function deserializeUser(spotifyId, done) {
  findUserBySpotifyId(spotifyId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
};
