// //////////////////////////
// Internal dependencies  //
// //////////////////////////

const logger = require('../../../logger');
const refreshToken = require('../../../auth/token/refreshToken');

function tokenExpired(tokenUpdated, expiresIn) {
  return tokenUpdated + expiresIn <= Date.now();
}

async function getValidAccessToken(user) {
  if (!user || !user.spotifyAccessToken) {
    throw new Error('Request has no user or access token');
  }

  const requiresRefresh = tokenExpired(user.tokenUpdated, user.expiresIn);
  if (!requiresRefresh) {
    return user.spotifyAccessToken;
  }

  logger.info('Refreshing user access token...');
  const updatedUser = await refreshToken(user.spotifyRefreshToken);
  logger.info('Successfully updated user access token.');
  return updatedUser.spotifyAccessToken;
}

module.exports = async function apiRequestWithRefresh({
  user,
  apiFn,
}) {
  return apiFn(await getValidAccessToken(user));
};
