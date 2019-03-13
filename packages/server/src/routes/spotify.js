// //////////////////////////
// External dependencies  //
// //////////////////////////

const express = require('express');

// //////////////////////////
// Internal dependencies  //
// //////////////////////////

const logger = require('../logger');
const { spotifyApiWithToken } =
  require('../spotify/api/SpotifyApi');
const apiRequestWithRefresh =
  require('../spotify/api/helpers/apiRequestWithRefresh');
const getCurrentlyPlayingRelatedAlbums =
  require('../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums');

// ////////////
// Helpers  //
// ////////////

function errorMessage(error) {
  if (error.data) {
    const dataObj = JSON.parse(error.data);
    return dataObj.error_description;
  }

  return error.message || 'Unknown Error';
}

// ////////////
// Globals  //
// ////////////

const router = express.Router();

// ////////////////////
// Route functions  //
// ////////////////////

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
router.get('/currently-playing/related-albums', async (req, res) => {
  const {
    query: {
      songId,
    },
    user,
  } = req;

  try {
    res.send(await apiRequestWithRefresh({
      user,
      apiFn: (accessToken) => {
        const spotifyApi = spotifyApiWithToken(accessToken);
        return getCurrentlyPlayingRelatedAlbums(spotifyApi, songId);
      },
    }));
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});

/**
* `/me` endpoint.
*
* Returns the user's profile; this is a simple proxy.
*/
router.get('/me', async (req, res) => {
  const {
    user,
  } = req;

  try {
    const result = await apiRequestWithRefresh({
      user,
      apiFn: accessToken => spotifyApiWithToken(accessToken).getMe(),
    });
    res.send(result.body);
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});

/**
 * `/me/player` endpoint.
 *
 * Returns the current state of the player; this is a simple proxy.
 */
router.get('/me/player', async (req, res) => {
  const {
    user,
  } = req;

  try {
    const result = await apiRequestWithRefresh({
      user,
      apiFn: accessToken =>
        spotifyApiWithToken(accessToken).getMyCurrentPlaybackState(),
    });
    res.send(result.body);
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});

module.exports = router;
