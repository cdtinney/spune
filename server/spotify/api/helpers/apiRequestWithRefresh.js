////////////////////////////
// Internal dependencies  //
////////////////////////////

const refreshToken =
  require('../../auth/refreshToken');

function getAccessToken(user) {
  if (!user || !user.spotifyAccessToken) {
    throw new Error('Request has no user or access token');
  }

  return user.spotifyAccessToken;
}

module.exports = function apiRequestWithRefresh({
  user,
  apiFn,
  maxAttempts = 3,
  handleSuccess,
  handleAuthFailure,
  handleError,
}) {
  let currAttempt = 1;
  function makeRequest() {
    if (currAttempt === maxAttempts) {
      return handleAuthFailure();
    }

    currAttempt += 1;

    const accessToken = getAccessToken(user);
    apiFn(accessToken)
      // Success!
      .then(handleSuccess)
      .catch((error) => {
        // Unauthorized -- try refreshing the token.
        if (error.statusCode === 401) {
          refreshToken(user.spotifyRefreshToken)
            .then((updatedUser) => {
              // This will update the tokens available for the request.
              user = updatedUser;
              // Retry the request.
              makeRequest();
            })
            // Failed to refresh token -- pass on.
            .catch(handleError);
          return;
        }

        handleError(error);
      });
  }

  makeRequest();
};
