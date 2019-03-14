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

export const nowPlayingArtists =
  createSelector(
    nowPlayingInfoSelector,
    (info) => info.songArtists,
  );

export const nowPlayingArtistNamesSelector =
  createSelector(
    nowPlayingArtists,
    (artists) => {
      return (artists || [])
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
      // Shuffling _before_ splicing ensures that we
      // get a wider variety of albums.
      const shuffledIds = shuffle(allAlbumIds);
      const displayedIds = shuffledIds.slice(0, numAlbums);
      const displayedAlbums = displayedIds.map(id => byAlbumId[id]);
      return displayedAlbums
        .map((album, index)=> ({
          id: `${album.id}_${index}`,
          title: album.name,
          images: {
            // The first image is technically the full size but
            // we're not enlarging the album thumbnails any bigger than
            // the mid-size image (300px by 300px) so there's
            // no point in wasting the bandwidth.
            fullSize: album.images[1].url,
            thumbnail: album.images[album.images.length - 1].url,
          },
        }));
    },
  );
