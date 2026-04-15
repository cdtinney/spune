'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = deserializeUser;
const userQueries_1 = require('../../database/queries/userQueries');
function deserializeUser(spotifyId, done) {
  (0, userQueries_1.findUserBySpotifyId)(spotifyId)
    .then((user) => done(null, user))
    .catch((err) => done(err));
}
//# sourceMappingURL=deserializeUser.js.map
