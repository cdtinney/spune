'use strict';

const Spotify = require('spotify-web-api-node');
const querystring = require('querystring');
const express = require('express');

const generateCookie = require('../modules/generateCookie.js');

const router = new express.Router();

// const SPOT_CLIENT_ID = process.env.client_id;
// const SPOT_CLIENT_SECRET = process.env.client_secret;
const SPOT_REDIRECT_URI = process.env.redirect_uri || 'http://localhost:5000/callback';
const SPOT_SCOPES = [ 'user-read-private', 'user-read-email' ];

const SPOT_AUTH_STATE_KEY = 'spotify_auth_state';

// Configure the Spotify API client.
const spotifyApi = new Spotify({
  clientId: 'c5538c30ef864e4fa9e22108528af89f',
  clientSecret: 'b46744c05d814a92b4b39bc8dfea5a4f',
  redirectUri: SPOT_REDIRECT_URI,
});

/**
 * /login endpoint.
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
 * /callback endpoint.
 * 
 * Hit after the user authorizes with Spotify.
 * 
 * First, verify that the state we stored in the cookie matches the state in the query
 * parameter.
 * 
 * If it matches, redirect to /user.
 * If not, redirect to /error.
 */
router.get('/callback', (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[SPOT_AUTH_STATE_KEY] : null;
    if (state === null || state !== storedState) {
        res.redirect('/#/error/state mismatch');
        return;
    }
  
    res.clearCookie(SPOT_AUTH_STATE_KEY);

    // Retrieve an access token and a refresh token
    spotifyApi.authorizationCodeGrant(code).then(data => {
        const { expires_in, access_token, refresh_token } = data.body;

        // Set the access token on the API object to use later.
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        // Use the access token to access the Spotify Web API.
        spotifyApi.getMe().then(({ body }) => {
            console.log(body);
        });

        // Pass the token to the client in order to make requests from
        // the client itself.
        res.redirect(`/#/user/${access_token}/${refresh_token}`);
    }).catch(err => res.redirect('/#/error/invalid token'));
});

module.exports = router;