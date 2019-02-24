////////////////////////////
// External dependencies  //
////////////////////////////

const refresh = require('passport-oauth2-refresh');

////////////////////////////
// Internal dependencies  //
////////////////////////////

const User = require('../../database/schema/User');

module.exports = function refreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    refresh.requestNewAccessToken(
      'spotify',
      refreshToken,
      function(err, accessToken) {
        if (err) {
          return reject(err);
        }
  
        return User.findOneAndUpdate({
          spotifyRefreshToken: refreshToken,
        }, {
          $set: {
            spotifyAccessToken: accessToken,
            tokenUpdated: Date.now(),
          },
        }, {
          returnNewDocument: true,
        }, function(err, user) {
          if (err) {
            return reject(err);
          }
          
          console.log(`Refreshed access token for user '${user.spotifyId}'`);
          console.trace();
          resolve(user);
        });
      },
    );
  });
};
