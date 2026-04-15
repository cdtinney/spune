'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.default = apiRequestWithRefresh;
const logger_1 = __importDefault(require('../../../logger'));
const refreshToken_1 = __importDefault(require('../../auth/refreshToken'));
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
  logger_1.default.info('Refreshing user access token...');
  const updatedUser = await (0, refreshToken_1.default)(user.spotifyRefreshToken);
  logger_1.default.info('Sucessfully updated user access token.');
  return updatedUser.spotifyAccessToken;
}
async function apiRequestWithRefresh({ user, apiFn }) {
  return apiFn(await getValidAccessToken(user));
}
//# sourceMappingURL=apiRequestWithRefresh.js.map
