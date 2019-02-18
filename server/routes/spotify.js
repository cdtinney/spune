const { spotifyApiWithToken } =
  require('../spotify/api/SpotifyApi');
const getRelatedArtists =
  require('../spotify/api/helpers/getRelatedArtists');
const getArtistStudioAlbums =
  require('../spotify/api/helpers/getArtistStudioAlbums');

const combineTrackArtists =
  require('../spotify/utils/combineTrackArtists');

//////////////
// Helpers  //
//////////////

function accessToken(req) {
  if (!req.user || !req.user.spotifyAccessToken) {
    throw new Error('Request has no user or access token');
  }

  return req.user.spotifyAccessToken;
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
  } = req;

  const spotifyApi = spotifyApiWithToken(accessToken(req));

  // TODO Extract to function
  spotifyApi.getMyCurrentPlayingTrack().then((response) => {
    const {
      item: {
        id,
        artists: songArtists,
        album: {
          artists: albumArtists,
        },
      },
    } = response.body;

    // ID mismatch
    if (songId !== id) {
      return next(`Song ID mismatch (currently playing = ${id}, query = ${songId})`);
    }

    return combineTrackArtists({
      songArtists,
      albumArtists,
    });
  }).then((trackArtists) => {
    return getRelatedArtists(spotifyApi, trackArtists);
  }).then((artistIds) => {
    const requests = [...artistIds]
      .map(artistId => getArtistStudioAlbums(spotifyApi, artistId));
    Promise.all(requests)
      .then(artistAlbums => res.send(artistAlbums))
      .catch(next);
  })
  .catch(next);
};

function me(req, res, next) {
  spotifyApiWithToken(accessToken(req)).getMe()
    .then(response => res.send(response.body))
    .catch(next);
};

function mePlayer(req, res, next) {
  spotifyApiWithToken(accessToken(req)).getMyCurrentPlaybackState()
    .then(response => res.send(response.body))
    .catch(next);
};

module.exports.currentlyPlayingRelatedAlbums = currentlyPlayingRelatedAlbums;
module.exports.me = me;
module.exports.mePlayer = mePlayer;
