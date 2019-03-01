const Spotify = require('spotify-web-api-node');

module.exports = Spotify;

module.exports.spotifyApiWithToken = function withToken(accessToken) {
  const spotifyApi = new Spotify();
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
};
