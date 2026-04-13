const { SpotifyApi } = require('@spotify/web-api-ts-sdk');

const SPOT_CLIENT_ID = process.env.SPOT_CLIENT_ID || '';

module.exports.spotifyApiWithToken = function withToken(accessToken) {
  return SpotifyApi.withAccessToken(SPOT_CLIENT_ID, {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: '',
  });
};
