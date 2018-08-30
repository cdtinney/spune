//////////////////////////
// External dependencies//
//////////////////////////

import Spotify from 'spotify-web-api-js';

const spotifyApi = new Spotify();

//////////
// Types//
//////////

export const SET_TOKENS = 'SPOTIFY/SET_TOKENS';
export const FETCH_USER_INFO_REQUEST = 'SPOTIFY/FETCH_USER_INFO_REQUEST';
export const FETCH_USER_INFO_SUCCESS = 'SPOTIFY/FETCH_USER_INFO_SUCCESS';
export const FETCH_USER_INFO_FAILURE = 'SPOTIFY/FETCH_USER_INFO_FAILURE';
export const FETCH_NOW_PLAYING_REQUEST = 'SPOTIFY/FETCH_NOW_PLAYING_REQUEST';
export const FETCH_NOW_PLAYING_SUCCESS = 'SPOTIFY/FETCH_NOW_PLAYING_SUCCESS';
export const FETCH_NOW_PLAYING_FAILURE = 'SPOTIFY/FETCH_NOW_PLAYING_FAILURE';
export const ADD_RELATED_ALBUMS = 'SPOTIFY/ADD_RELATED_ALBUMS';

//////////////
// Creators //
//////////////

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    spotifyApi.setAccessToken(accessToken);
  }
  
  return {
    type: SET_TOKENS,
    payload: {
      accessToken,
      refreshToken,
    },
  };
}

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

export function addRelatedAlbums(albums) {
  return {
    type: ADD_RELATED_ALBUMS,
    payload: {
      albums,
    },
  };
}

export function getRelatedAlbums() {
  return function getRelatedAlbumsThunk(dispatch, getState) {
    const {
      nowPlaying: {
        info: {
          songArtists = [],
          albumArtists = [],
        },
      },
    } = getState();

    const artistIds =
      songArtists
        .concat(albumArtists)
        .map(artist => artist.id);

    const uniqueArtistIds = new Set(artistIds);    
    uniqueArtistIds.forEach(id => {
      spotifyApi.getArtistAlbums(id, {
        include_groups: 'album',
      }).then((data) => {
        const {
          items,
        } = data;

        const albums = items.map(item => ({
          id: item.id,
          images: item.images,
          name: item.name,
          uri: item.uri,
        }));

        dispatch(addRelatedAlbums(albums))
      }).catch(console.err);
    });
  };
}

export function getNowPlaying() {
  return function getNowPlayingThunk(dispatch, getState) {
    const {
      nowPlaying: {
        request: {
          loading,
        },
        info: {
          songId: currentSongId,
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

      if (currentSongId !== songId) {
        dispatch(getRelatedAlbums());
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
