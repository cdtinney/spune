const serializeUser = require('./serialization/serializeUser');
const deserializeUser = require('./serialization/deserializeUser');

module.exports = function configurePassport(passport) {
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};
