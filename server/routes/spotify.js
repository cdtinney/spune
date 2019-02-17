const spotifyApi = require('../api/spotifyApi');

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

async function fetchArtistStudioAlbums(artistId) {
  return spotifyApi.getArtistAlbums(artistId, {
    include_groups: 'album', // Ignore compilations/appears on/etc.
  }).then(data => ({
    artistId,
    albums: data.body,
  }));
}

/**
* `/currently-playing/related-albums` endpoint.
*
* Returns a list of albums related to the currently playing track.
*/
module.exports.currentlyPlayingRelatedAlbums = function currentlyPlayingRelatedAlbums(req, res) {
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
    const requests = [...artistIds]
      .map(fetchArtistStudioAlbums);
    Promise.all(requests)
      .then(artistAlbums => res.send(artistAlbums));
  }).catch((error) => {
    console.error(error);
    res.send(error);
  });

  // TODO Get all related artists, de-duplicate
  // TODO Get related artist albums
  // TODO Combine everything into one result
};
