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

function send401Response(response, error = {}) {
  return response.status(401).json(error).end();
}

//////////////////////
// Route functions  //
//////////////////////

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
function currentlyPlayingRelatedAlbums(req, res, next) {
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
    handleSuccess: res.send.bind(res),
    handleAuthFailure: send401Response.bind(undefined, res),
    handleError: next,
  });
};

/**
* `/me` endpoint.
*
* Returns the user's profile; this is a simple proxy.
*/
function me(req, res, next) {
  let {
    user,
  } = req;

  apiRequestWithRefresh({
    user,
    apiFn: (accessToken) => {
      return spotifyApiWithToken(accessToken).getMe();
    },
    handleSuccess: response => res.send(response.body),
    handleAuthFailure: send401Response.bind(undefined, res),
    handleError: next,
  });
};

/**
 * `/me/player` endpoint.
 *
 * Returns the current state of the player; this is a simple proxy.
 */
function mePlayer(req, res, next) {
  const {
    user,
  } = req;

  apiRequestWithRefresh({
    user,
    apiFn: (accessToken) => {
      return spotifyApiWithToken(accessToken).getMyCurrentPlaybackState();
    },
    handleSuccess: response => res.send(response.body),
    handleAuthFailure: send401Response.bind(undefined, res),
    handleError: next,
  });
};

module.exports = function initRoutes(router) {
  router.get('/spotify/me', me);
  router.get('/spotify/me/player', mePlayer);
  router.get('/spotify/currently-playing/related-albums', currentlyPlayingRelatedAlbums);  
};

module.exports.currentlyPlayingRelatedAlbums = currentlyPlayingRelatedAlbums;
module.exports.me = me;
module.exports.mePlayer = mePlayer;
