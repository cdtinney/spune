const Spotify = require('spotify-web-api-node');

module.exports = Spotify;

module.exports.spotifyApiWithToken = function withToken(accessToken) {
  const spotify = new Spotify();
  spotify.setAccessToken(accessToken);
  return spotify;
}
