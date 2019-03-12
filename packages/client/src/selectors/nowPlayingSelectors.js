////////////////////////////
// External dependencies  //
////////////////////////////

import { createSelector } from 'reselect';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import shuffle from '../utils/shuffle';
import * as uiSelectors from './uiSelectors';

export function nowPlayingInfoSelector(state) {
  return state.spotify.nowPlaying.info;
}

export function nowPlayingRelatedAlbumsById(state) {
  return state.spotify.nowPlaying.relatedAlbums.byAlbumId;
}

export function nowPlayingRelatedAlbumsAllIds(state) {
  return state.spotify.nowPlaying.relatedAlbums.allAlbumIds;
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
    nowPlayingRelatedAlbumsById,
    nowPlayingRelatedAlbumsAllIds,
    uiSelectors.uiAlbumGridNumAlbumsSelector,
    (byAlbumId, allAlbumIds, numAlbums) => {
      const displayedIds = allAlbumIds.slice(0, numAlbums);
      const shuffledIds = shuffle(displayedIds);
      const displayedAlbums = shuffledIds.map(id => byAlbumId[id]);
      return displayedAlbums
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
