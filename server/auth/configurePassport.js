const serializeUser = require('./serialization/serializeUser');
const deserializeUser = require('./serialization/deserializeUser');
const spotifyPassportStrategy = require('../spotify/auth/passportStrategy');

module.exports = function configurePassport(passport) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(spotifyPassportStrategy());
};
