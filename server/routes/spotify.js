'use strict';

const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const express = require('express');

const generateCookie = require('../modules/generateCookie.js');

const router = new express.Router();

const CLIENT_ID = process.env.SPOT_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOT_CLIENT_SECRET;
const SPOT_REDIRECT_URI = process.env.redirect_uri || 'http://localhost:5000/callback';
const SPOT_SCOPES = [ 'user-read-private', 'user-read-email' ];

const SPOT_AUTH_STATE_KEY = 'spotify_auth_state';

// Configure the Spotify API client.
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: SPOT_REDIRECT_URI,
});

const CLIENT_HOST = process.env.CLIENT_HOST || '';

/**
 * `/login` endpoint.
 * 
 * Redirects the client to the Spotify authorize url, setting
 * the user's state in cookie first.
 */
router.get('/login', (req, res) => {
  const state = generateCookie(16);
  res.cookie(SPOT_AUTH_STATE_KEY, state);
  res.redirect(spotifyApi.createAuthorizeURL(SPOT_SCOPES, state));
});

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
router.get('/callback', (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[SPOT_AUTH_STATE_KEY] : null;
    if (state === null || state !== storedState) {
        res.redirect(`${CLIENT_HOST}/#/error/state mismatch`);
        return;
    }
  
    res.clearCookie(SPOT_AUTH_STATE_KEY);

    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(async (data) => {
        const { access_token, refresh_token } = data.body;

        // Set the access token on the API object to use later.
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        // Pass the token to the client in order to make requests from
        // the client itself.
        res.redirect(`${CLIENT_HOST}/#/user/${access_token}/${refresh_token}`);
    }).catch(err => res.redirect(`${CLIENT_HOST}/#/error/invalid token`));
});

module.exports = router;