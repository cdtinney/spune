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

module.exports = async function apiRequestWithRefresh({
  user,
  apiFn,
  maxAttempts = 3,
  handleSuccess,
  handleAuthFailure,
  handleError,
}) {
  let currAttempt = 1;
  async function makeRequest() {
    if (currAttempt === maxAttempts) {
      return handleAuthFailure('Retries exceeded');
    }

    currAttempt += 1;

    try {
      const accessToken = getAccessToken(user);
      const apiResponse = await apiFn(accessToken);
      // Success!
      handleSuccess(apiResponse);
      return;
    } catch (error) {
      // Unauthorized -- try refreshing the token.
      if (error.statusCode === 401) {
        try {
          const updatedUser = await refreshToken(user.spotifyRefreshToken);
          // This will update the tokens available for the request.
          user = updatedUser;
          // Retry the request.
          makeRequest();
        } catch(error) {
          handleError(error);
        }
        
        // All done.
        return;
      }

      handleError(error);
    }
  }

  makeRequest();
};
