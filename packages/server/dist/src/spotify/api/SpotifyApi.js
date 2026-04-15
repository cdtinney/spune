'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.spotifyApiWithToken = spotifyApiWithToken;
const web_api_ts_sdk_1 = require('@spotify/web-api-ts-sdk');
const SPOT_CLIENT_ID = process.env.SPOT_CLIENT_ID || '';
function spotifyApiWithToken(accessToken) {
  return web_api_ts_sdk_1.SpotifyApi.withAccessToken(SPOT_CLIENT_ID, {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: '',
  });
}
//# sourceMappingURL=SpotifyApi.js.map
