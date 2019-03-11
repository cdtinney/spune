////////////////////////////
// External dependencies  //
////////////////////////////

import { createSelector } from 'reselect';

////////////////////////////
// Internal dependencies  //
////////////////////////////

export function nowPlayingInfoSelector(state) {
  return state.spotify.nowPlaying.info;
}

export function nowPlayingRelatedAlbumsByAlbumId(state) {
  return state.spotify.nowPlaying.relatedAlbums.byAlbumId;
}

export function nowPlayingRelatedAlbumIdsToDisplay(state) {
  return state.spotify.nowPlaying.relatedAlbums.displayedAlbumIds;
}

export const nowPlayingArtistNamesSelector =
  createSelector(
    nowPlayingInfoSelector,
    (info) => {
      return (info.songArtists || [])
        .map(artist => artist.name)
        .join(', ');
    },
  );

export const relatedAlbumImagesSelector =
  createSelector(
    nowPlayingRelatedAlbumsByAlbumId,
    nowPlayingRelatedAlbumIdsToDisplay,
    (byAlbumId, albumIdsToDisplay) => {
      return albumIdsToDisplay
        .map(id => byAlbumId[id])
        .map((album, index)=> ({
          id: `${album.id}_${index}`,
          title: album.name,
          images: {
            fullSize: album.images[0].url,
            thumbnail: album.images[album.images.length - 1].url,
          },
        }));
    },
  );
