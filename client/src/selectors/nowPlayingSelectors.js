import { createSelector } from 'reselect';

export function nowPlayingInfoSelector(state) {
  return state.spotify.nowPlaying.info;
}

export function nowPlayingRelatedAlbumArtists(state) {
  return state.spotify.nowPlaying.relatedAlbums.byArtist;
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
    nowPlayingRelatedAlbumArtists,
    (byArtist) => {
      return Object.values(byArtist)
        // Flatten the array first
        // TODO Use util
        .reduce((acc, curr) => {
          return acc.concat(curr.albums);
        }, []).map(album => ({
          title: album.name,
          images: {
            fullSize: album.images[0].url,
            thumbnail: album.images[album.images.length - 1].url,
          },
        }));
    },
  );
