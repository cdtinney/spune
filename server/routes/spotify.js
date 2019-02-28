////////////////////////////
// External dependencies  //
////////////////////////////

const express = require('express');

////////////////////////////
// Internal dependencies  //
////////////////////////////

const { spotifyApiWithToken } =
  require('../spotify/api/SpotifyApi');
const apiRequestWithRefresh =
  require('../spotify/api/helpers/apiRequestWithRefresh');
const getCurrentlyPlayingRelatedAlbums =
  require('../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums');

//////////////
// Helpers  //
//////////////

function errorResponse(response, statusCode, errorObj) {
  return response.status(statusCode).json(errorObj).end();
}

//////////////
// Globals  //
//////////////

const router = express.Router();

//////////////////////
// Route functions  //
//////////////////////

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
router.get('/currently-playing/related-albums', function currentlyPlayingRelatedAlbums(req, res) {
  const {
    query: {
      songId,
    },
    user,
  } = req;

  apiRequestWithRefresh({
    user,
    apiFn: (accessToken) => {
      const spotifyApi = spotifyApiWithToken(accessToken);
      return getCurrentlyPlayingRelatedAlbums(spotifyApi, songId);
    },
    handleSuccess: (result) => res.send(result),
    handleAuthFailure: (error) => errorResponse(res, 401, error),
    handleError: (error) => errorResponse(res, 400, error),
  });
});

/**
* `/me` endpoint.
*
* Returns the user's profile; this is a simple proxy.
*/
router.get('/me', function me(req, res, next) {
  let {
    user,
  } = req;

  apiRequestWithRefresh({
    user,
    apiFn: (accessToken) => {
      return spotifyApiWithToken(accessToken).getMe();
    },
    handleSuccess: (result) => res.send(result.body),
    handleAuthFailure: (error) => errorResponse(res, 401, error),
    handleError: (error) => errorResponse(res, 400, error),
  });
});

/**
 * `/me/player` endpoint.
 *
 * Returns the current state of the player; this is a simple proxy.
 */
router.get('/me/player', function mePlayer(req, res) {
  const {
    user,
  } = req;

  apiRequestWithRefresh({
    user,
    apiFn: (accessToken) => {
      return spotifyApiWithToken(accessToken).getMyCurrentPlaybackState();
    },
    handleSuccess: (result) => res.send(result.body),
    handleAuthFailure: (error) => errorResponse(res, 401, error),
    handleError: (error) => errorResponse(res, 400, error),
  });
});

module.exports = router;
