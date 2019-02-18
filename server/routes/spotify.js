const { spotifyApiWithToken } = require('../spotify/api/SpotifyApi');
const getRelatedArtists = require('../spotify/getRelatedArtists');
const uniqueAlbums = require('../spotify/uniqueAlbums');

//////////////
// Helpers  //
//////////////

async function fetchUniqueArtistAlbums(spotifyApi, artistId) {
  return spotifyApi.getArtistAlbums(artistId, {
    include_groups: 'album', // Ignore compilations/appears on/etc.
  }).then(data => ({
    artistId,
    albums: uniqueAlbums(data.body.items),
  }));
}

function combineTrackArtists({ songArtists, albumArtists }) {
  const artistIds =
    songArtists
      .concat(albumArtists)
      .map(artist => artist.id);

  // Use Set to filter for uniqueness
  return [...new Set(artistIds)];
}

//////////////////////
// Route functions  //
//////////////////////

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
module.exports.currentlyPlayingRelatedAlbums = function currentlyPlayingRelatedAlbums(req, res) {
  const {
    query: {
      songId,
    },
    user: {
      spotifyAccessToken,
    },
  } = req;

  const spotifyApi = spotifyApiWithToken(spotifyAccessToken);

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
      res.status(400).json({
        error: `Song ID mismatch (currently playing = ${id}, query = ${songId})`,
      });
      return;
    }

    return combineTrackArtists({
      songArtists,
      albumArtists,
    });
  }).then((trackArtists) => {
    return getRelatedArtists(spotifyApi, trackArtists);
  }).then((artistIds) => {
    const requests = [...artistIds]
      .map(artistId => fetchUniqueArtistAlbums(spotifyApi, artistId));
    Promise.all(requests)
      .then(artistAlbums => res.send(artistAlbums))
      .catch(error => console.error(error));
  })
  .catch((error) => {
    console.error(error);
    res.send(error);
  });
};

module.exports.me = function me(req, res) {
  spotifyApiWithToken(req.user.spotifyAccessToken).getMe()
    .then(response => res.send(response.body))
    .catch(error => res.status(400).json(error));
};

module.exports.mePlayer = function mePlayer(req, res) {
  spotifyApiWithToken(req.user.spotifyAccessToken).getMyCurrentPlaybackState()
    .then(response => res.send(response.body))
    .catch(error => res.status(400).json(error));
};
