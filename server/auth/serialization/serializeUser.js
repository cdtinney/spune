module.exports = function serializeUser(user, done) {
  return done(null, user.spotifyId);
};
