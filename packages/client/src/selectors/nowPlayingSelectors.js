////////////////////////////
// External dependencies  //
////////////////////////////

import { createSelector } from 'reselect';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import * as uiSelectors from './uiSelectors';

export function nowPlayingInfoSelector(state) {
  return state.spotify.nowPlaying.info;
}

export function nowPlayingRelatedAlbumsByAlbumId(state) {
  return state.spotify.nowPlaying.relatedAlbums.byAlbumId;
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
    uiSelectors.uiAlbumGridNumAlbumsSelector,
    (byAlbumId, numAlbums) => {
      return Object.keys(byAlbumId)
        .slice(0, numAlbums)
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
