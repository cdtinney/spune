const Spotify = require('spotify-web-api-node');

// Unpack environemnt variables needed for auth.
const {
  SPOT_CLIENT_ID,
  SPOT_CLIENT_SECRET,
  SPOT_REDIRECT_URI,
} = process.env;

// Configure the Spotify API client.
const spotifyApi = new Spotify({
  clientId: SPOT_CLIENT_ID,
  clientSecret: SPOT_CLIENT_SECRET,
  redirectUri: SPOT_REDIRECT_URI,
});

module.exports = spotifyApi;
