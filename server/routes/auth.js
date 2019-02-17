const spotifyApi = require('../spotify/api/spotifyApi');
const generateCookie = require('../utils/generateCookie.js');

const SPOTIFY_PERMISSION_SCOPES = [
  'user-read-private',
  'user-read-email',
  // Required for getting user's current playback info.
  'user-read-playback-state',
];

const SPOTIFY_AUTH_STATE_COOKIE_KEY =
  'spotify_auth_state';
const CLIENT_HOST = process.env.CLIENT_HOST || '';

/**
* `/login` endpoint.
*
* Redirects the client to the Spotify authorize url, setting
* the user's state in cookie first.
*/
module.exports.login = function login(req, res) {
  const state = generateCookie(16);
  res.cookie(SPOTIFY_AUTH_STATE_COOKIE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(SPOTIFY_PERMISSION_SCOPES, state));
};

/**
* `/callback` endpoint.
*
* Hit after the user authorizes with Spotify.
*
* First, we verify that the state we stored in the cookie matches the state in the query
* parameter.
*
* If it matches, redirect to /user with Spotify tokens as query parameters.
* If not, redirect to /error to display an error message.
*/
module.exports.callback = function callback(req, res) {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[SPOTIFY_AUTH_STATE_COOKIE_KEY] : null;
  if (state === null || state !== storedState) {
    res.redirect(`${CLIENT_HOST}/#/error/state mismatch`);
    return;
  }

  res.clearCookie(SPOTIFY_AUTH_STATE_COOKIE_KEY);

  // Retrieve an access token and a refresh token
  spotifyApi.authorizationCodeGrant(code).then(async (data) => {
    const { access_token, refresh_token } = data.body;

    // Set the access token on the API object to use later.
    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    // Pass the token to the client in order to make requests from
    // the client itself.
    res.redirect(`${CLIENT_HOST}/#/home/${access_token}/${refresh_token}`);
  }).catch(err => res.redirect(`${CLIENT_HOST}/#/error/invalid token`));
};
