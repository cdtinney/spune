'use strict';

const Spotify = require('spotify-web-api-node');
const express = require('express');

const generateCookie = require('../modules/generateCookie.js');

const router = new express.Router();

// Unpack environemnt variables needed for auth.
const {
  SPOT_CLIENT_ID: CLIENT_ID,
  SPOT_CLIENT_SECRET: CLIENT_SECRET,
  SPOT_REDIRECT_URI: REDIRECT_URI,
} = process.env;

// Permission scopes.
const SPOT_SCOPES = [
  'user-read-private',
  'user-read-email',
  // Required for getting user's current playback info.
  'user-read-playback-state',
];

const SPOT_AUTH_STATE_KEY = 'spotify_auth_state';

// Configure the Spotify API client.
const spotifyApi = new Spotify({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
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
    res.redirect(`${CLIENT_HOST}/#/home/${access_token}/${refresh_token}`);
  }).catch(err => res.redirect(`${CLIENT_HOST}/#/error/invalid token`));
});

// const uniqueAlbums =
//   itemsToAlbums(items, currentAlbumId)
//     // Ignore current album.
//     .filter(album => album.id !== currentAlbumId)
//     // Remove duplicates by name.
//     // For some reason, the API returns duplicates with different
//     // IDs and image URLs.
//     .filter((elem, index, self) => {
//       return self.findIndex(album => {
//         return album.name === elem.name;
//       }) === index;
//     });

function combineTrackArtists({ songArtists, albumArtists }) {
  const artistIds =
    songArtists
      .concat(albumArtists)
      .map(artist => artist.id);

  return new Set(artistIds);
}

// function itemsToAlbums(items) {
//   return items.map(item => ({
//     id: item.id,
//     images: item.images,
//     name: item.name,
//     uri: item.uri,
//   }));
//}

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
router.get('/currently-playing/related-albums', (req, res) => {
  // TODO Extract to method
  spotifyApi.getMyCurrentPlayingTrack().then((data) => {
    const {
      item: {
        artists: songArtists,
        album: {
          artists: albumArtists,
        },
      },
    } = data.body;

    // TODO Logging

    // TODO Error check for songId mismatch

    return combineTrackArtists({
      songArtists,
      albumArtists,
    });
  }).then((artistIds) => {
    function fetchArtistStudioAlbums(artistId) {
      return spotifyApi.getArtistAlbums(artistId, {
        include_groups: 'album', // Ignore compilations/appears on/etc.
      }).then(data => ({
        artistId,
        albums: data.body,
      }));
    }
      
    Promise.all([...artistIds].map(fetchArtistStudioAlbums))
      .then(artistAlbums => res.send(artistAlbums));
  }).catch((error) => {
    console.error(error);
    res.send(error);
  });

  // TODO Get all related artists, de-duplicate
  // TODO Get related artist albums
  // TODO Combine everything into one result
});

module.exports = router;