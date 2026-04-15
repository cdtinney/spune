'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = require('express');
const SpotifyApi_1 = require('../spotify/api/SpotifyApi');
const apiRequestWithRefresh_1 = __importDefault(
  require('../spotify/api/helpers/apiRequestWithRefresh'),
);
const getCurrentlyPlayingRelatedAlbums_1 = __importDefault(
  require('../spotify/api/helpers/getCurrentlyPlayingRelatedAlbums'),
);
function errorMessage(error) {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unknown Error';
}
const router = (0, express_1.Router)();
/**
 * `/currently-playing/related-albums` endpoint.
 *
 * Returns a list of albums related to the currently playing track.
 */
router.get('/currently-playing/related-albums', async (req, res) => {
  const {
    query: { songId },
  } = req;
  const user = req.user;
  try {
    res.send(
      await (0, apiRequestWithRefresh_1.default)({
        user,
        apiFn: (accessToken) => {
          const spotifyApi = (0, SpotifyApi_1.spotifyApiWithToken)(accessToken);
          return (0, getCurrentlyPlayingRelatedAlbums_1.default)(spotifyApi, songId);
        },
      }),
    );
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
  const user = req.user;
  try {
    const result = await (0, apiRequestWithRefresh_1.default)({
      user,
      apiFn: (accessToken) =>
        (0, SpotifyApi_1.spotifyApiWithToken)(accessToken).player.getPlaybackState(),
    });
    res.send(result);
  } catch (error) {
    res.status(500).send(errorMessage(error));
  }
});
exports.default = router;
//# sourceMappingURL=spotify.js.map
