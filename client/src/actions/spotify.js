///////////////////////////
// Internal dependencies //
///////////////////////////

// API
import SpotifyApi from '../api/SpotifyApi';

// Selectors
import * as nowPlayingSelectors from '../selectors/nowPlayingSelectors';

const spotifyApi = new SpotifyApi();

//////////
// Types//
//////////

export const FETCH_USER_INFO_REQUEST = 'SPOTIFY/FETCH_USER_INFO_REQUEST';
export const FETCH_USER_INFO_SUCCESS = 'SPOTIFY/FETCH_USER_INFO_SUCCESS';
export const FETCH_USER_INFO_FAILURE = 'SPOTIFY/FETCH_USER_INFO_FAILURE';

export const FETCH_NOW_PLAYING_REQUEST = 'SPOTIFY/FETCH_NOW_PLAYING_REQUEST';
export const FETCH_NOW_PLAYING_SUCCESS = 'SPOTIFY/FETCH_NOW_PLAYING_SUCCESS';
export const FETCH_NOW_PLAYING_FAILURE = 'SPOTIFY/FETCH_NOW_PLAYING_FAILURE';

export const CLEAR_NOW_PLAYING_RELATED_ALBUMS =
  'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/CLEAR';

export const FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST =
  'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_REQUEST';
export const FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS =
  'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_SUCCESS';
export const FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE =
  'SPOTIFY/NOW_PLAYING/RELATED_ALBUMS/FETCH_FAILURE';

///////////////
// Utilities //
///////////////

//////////////
// Creators //
//////////////

export function getMyInfo() {
  return function getMyInfoThunk(dispatch) {
    dispatch({ type: FETCH_USER_INFO_REQUEST });

    spotifyApi.getMe().then((data) => {
      const {
        id,
        display_name: displayName,
        images,
      } = data;

      dispatch({
        type: FETCH_USER_INFO_SUCCESS,
        payload: {
          info: {
            id,
            displayName,
            avatarImageUrl: images[0] ? images[0].url : '',
          },
        },
      });
    }).catch((err) => {
      dispatch({
        type: FETCH_USER_INFO_FAILURE,
        payload: new Error(err),
        error: true,
      });
    });
  };
}

export function clearNowPlayingRelatedAlbums() {
  return {
    type: CLEAR_NOW_PLAYING_RELATED_ALBUMS,
  };
}

export function fetchNowPlayingRelatedAlbumsRequest(songId) {
  return {
    type: FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
    payload: {
      songId,
    },
  };
}

export function fetchNowPlayingRelatedAlbumsSuccess(songId, albumsByArtist) {
  return {
    type: FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
    payload: {
      songId,
      albumsByArtist,
    },
  };
}
export function fetchNowPlayingRelatedAlbumsFailure(songId, error) {
  return {
    type: FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
    payload: {
      songId,
      error,
    },
    errored: true,
  };
}

function fetchNowPlayingRelatedAlbums() {
  return function fetchNowPlayingRelatedAlbumsThunk(dispatch, getState) {
    const {
      songId,
    } = nowPlayingSelectors.nowPlayingInfoSelector(getState());

    dispatch(fetchNowPlayingRelatedAlbumsRequest(songId));

    spotifyApi.getCurrentlyPlayingRelatedAlbums(songId)
      .then(data =>
        dispatch(fetchNowPlayingRelatedAlbumsSuccess(songId, data)))
      .catch(error =>
        dispatch(fetchNowPlayingRelatedAlbumsFailure(songId, error)));
  };
}

export function getNowPlaying() {
  return function getNowPlayingThunk(dispatch, getState) {
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
      return;
    }

    dispatch({ type: FETCH_NOW_PLAYING_REQUEST });

    spotifyApi.getMyCurrentPlaybackState().then((data) => {
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
        type: FETCH_NOW_PLAYING_SUCCESS,
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
        dispatch(fetchNowPlayingRelatedAlbums());
      }
    }).catch((err) => {
      dispatch({
        type: FETCH_NOW_PLAYING_FAILURE,
        payload: new Error(err),
        error: true,
      });
    });
  };
}
