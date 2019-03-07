///////////////////////////
// Internal dependencies //
///////////////////////////

// API
import SpotifyApi from '../api/SpotifyApi';

// Selectors
import * as nowPlayingSelectors from '../selectors/nowPlayingSelectors';

// Cyclic import to assist in mocking for unit tests
import * as thisModule from './spotify';

const spotifyApi = new SpotifyApi();

///////////
// Types //
///////////

export const types = {
  FETCH_USER_INFO_REQUEST:
    'SPOTIFY/FETCH_USER_INFO_REQUEST',
  FETCH_USER_INFO_SUCCESS:
    'SPOTIFY/FETCH_USER_INFO_SUCCESS',
  FETCH_USER_INFO_FAILURE:
    'SPOTIFY/FETCH_USER_INFO_FAILURE',
  FETCH_NOW_PLAYING_INFO_REQUEST:
    'SPOTIFY/FETCH_NOW_PLAYING_INFO_REQUEST',
  FETCH_NOW_PLAYING_INFO_SUCCESS:
    'SPOTIFY/FETCH_NOW_PLAYING_INFO_SUCCESS',
  FETCH_NOW_PLAYING_INFO_FAILURE:
    'SPOTIFY/FETCH_NOW_PLAYING_INFO_FAILURE',
  CLEAR_NOW_PLAYING_RELATED_ALBUMS:
    'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/CLEAR',
  FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST:
    'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_REQUEST',
  FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS:
    'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_SUCCESS',
  FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE:
    'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_FAILURE',
};

//////////////
// Creators //
//////////////

export function fetchMyInfo() {
  return function fetchMyInfoThunk(dispatch) {
    dispatch({ type: types.FETCH_USER_INFO_REQUEST });

    return spotifyApi.getMe().then((data) => {
      const {
        id,
        display_name: displayName,
        images,
      } = data;

      dispatch({
        type: types.FETCH_USER_INFO_SUCCESS,
        payload: {
          info: {
            id,
            displayName,
            avatarImageUrl: images && images.length && images[0] ? images[0].url : '',
          },
        },
      });
    }).catch((err) => {
      dispatch({
        type: types.FETCH_USER_INFO_FAILURE,
        payload: new Error(err),
        error: true,
      });
    });
  };
}

export function clearNowPlayingRelatedAlbums() {
  return {
    type: types.CLEAR_NOW_PLAYING_RELATED_ALBUMS,
  };
}

export function fetchNowPlayingRelatedAlbumsRequest(songId) {
  return {
    type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
    payload: {
      songId,
    },
  };
}

export function fetchNowPlayingRelatedAlbumsSuccess(songId, albumsByArtist) {
  return {
    type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
    payload: {
      songId,
      albumsByArtist,
    },
  };
}
export function fetchNowPlayingRelatedAlbumsFailure(error) {
  return {
    type: types.FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
    payload: new Error(error),
    error: true,
  };
}

export function fetchNowPlayingRelatedAlbums() {
  return function fetchNowPlayingRelatedAlbumsThunk(dispatch, getState) {
    const {
      songId,
    } = nowPlayingSelectors.nowPlayingInfoSelector(getState());

    dispatch(fetchNowPlayingRelatedAlbumsRequest(songId));

    return spotifyApi.getCurrentlyPlayingRelatedAlbums(songId)
      .then(data =>
        dispatch(fetchNowPlayingRelatedAlbumsSuccess(songId, data)))
      .catch(error =>
        dispatch(fetchNowPlayingRelatedAlbumsFailure(error)));
  };
}

export function fetchNowPlayingInfo() {
  return function fetchNowPlayingInfoThunk(dispatch, getState) {
    const {
      spotify: {
        nowPlaying: {
          request: {
            loading,
          },
          info: {
            albumId: currentAlbumId,
          },
        },
      },
    } = getState();

    // Ignore if already fetching.
    if (loading) {
      return Promise.resolve(); // We should always return the same type (Promise).
    }

    dispatch({ type: types.FETCH_NOW_PLAYING_INFO_REQUEST });

    return spotifyApi.getMyCurrentPlaybackState().then((data) => {
      const {
        item: {
          id: songId,
          name: songTitle,
          artists: songArtists,
          album: {
            id: albumId,
            name: albumName,
            images: albumImages,
            artists: albumArtists,
          },
        },
      } = data;

      dispatch({
        type: types.FETCH_NOW_PLAYING_INFO_SUCCESS,
        payload: {
          info: {
            songId,
            songTitle,
            songArtists,
            albumId,
            albumName,
            albumArtists,
            // Use the largest album image (first in array).
            albumImageUrl: albumImages[0].url,
          },
        },
      });

      // If the album has changed, update the related
      // albums.
      if (currentAlbumId !== albumId) {
        dispatch(thisModule.fetchNowPlayingRelatedAlbums());
      }
    }).catch((err) => {
      dispatch({
        type: types.FETCH_NOW_PLAYING_INFO_FAILURE,
        payload: new Error(err),
        error: true,
      });
    });
  };
}
