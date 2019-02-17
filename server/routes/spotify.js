const spotifyApi = require('../spotify/api/spotifyApi');
const getRelatedArtists = require('../spotify/getRelatedArtists');

function uniqueAlbums(albums) {
  // Remove duplicates by name.
  // For some reason, the API returns duplicates with different
  // IDs and image URLs.
  const uniqueMap = albums.reduce((map, album) => {
    if (map[album.name]) {
      return map;
    }

    map[album.name] = album;
    return map;
  }, {});
  return Object.values(uniqueMap);
}

async function fetchUniqueArtistAlbums(artistId) {
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

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
module.exports.currentlyPlayingRelatedAlbums = function currentlyPlayingRelatedAlbums(req, res) {
  const {
    songId,
  } = req.query;

  // TODO Extract to method
  spotifyApi.getMyCurrentPlayingTrack().then((data) => {
    const {
      item: {
        id,
        artists: songArtists,
        album: {
          artists: albumArtists,
        },
      },
    } = data.body;

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
  }).then(getRelatedArtists)
    .then((artistIds) => {
      const requests = [...artistIds]
        .map(fetchUniqueArtistAlbums);
      Promise.all(requests)
        .then(artistAlbums => res.send(artistAlbums));
    })
    .catch((error) => {
      console.error(error);
      res.send(error);
    });
};
