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

export const CLEAR_RELATED_ALBUMS = 'SPOTIFY/RELATED_ALBUMS/CLEAR';

export const FETCH_RELATED_ARTIST_ALBUMS_REQUEST =
  'SPOTIFY/RELATED_ALBUMS/FETCH_ARTIST_ALBUMS_REQUEST';
export const FETCH_RELATED_ARTIST_ALBUMS_SUCCESS =
  'SPOTIFY/RELATED_ALBUMS/FETCH_ARTIST_ALBUMS_SUCCESS';
export const FETCH_RELATED_ARTIST_ALBUMS_FAILURE =
  'SPOTIFY/RELATED_ALBUMS/FETCH_ARTIST_ALBUMS_FAILURE';

///////////////
// Utilities //
///////////////

function itemsToAlbums(items) {
  return items.map(item => ({
    id: item.id,
    images: item.images,
    name: item.name,
    uri: item.uri,
  }));
}

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

export function clearRelatedAlbums() {
  return {
    type: CLEAR_RELATED_ALBUMS,
  };
}

export function fetchArtistAlbumsRequest(artistId) {
  return {
    type: FETCH_RELATED_ARTIST_ALBUMS_REQUEST,
    payload: {
      artistId,
    },
  };
}

export function fetchArtistAlbumsSuccess(artistId, albums) {
  return {
    type: FETCH_RELATED_ARTIST_ALBUMS_SUCCESS,
    payload: {
      artistId,
      albums,
    },
  };
}
export function fetchArtistAlbumsFailure(artistId, error) {
  return {
    type: FETCH_RELATED_ARTIST_ALBUMS_FAILURE,
    payload: {
      artistId,
      error: error,
    },
    errored: true,
  };
}

function fetchArtistAlbums(artistId) {
  return function fetchAlbumsForArtistThunk(dispatch, getState) {
    const {
      nowPlaying: {
        info: {
          albumId: currentAlbumId,
        },
      },
    } = getState();

    dispatch(fetchArtistAlbumsRequest(artistId));

    spotifyApi.getArtistAlbums(artistId, {
      include_groups: 'album',
    }).then((data) => {
      const {
        items,
      } = data;

      const uniqueAlbums =
        itemsToAlbums(items, currentAlbumId)
          // Ignore current album.
          .filter(album => album.id !== currentAlbumId)
          // Remove duplicates by name.
          // For some reason, the API returns duplicates with different
          // IDs and image URLs.
          .filter((elem, index, self) => {
            return self.findIndex(album => {
              return album.name === elem.name;
            }) === index;
          });

      dispatch(fetchArtistAlbumsSuccess(artistId, uniqueAlbums));
    }).catch((error) => {
      console.error(error);
      dispatch(fetchArtistAlbumsFailure(artistId, error));
    });
  };
}

export function fetchRelatedAlbums() {
  return function fetchRelatedAlbumsThunk(dispatch, getState) {
    const {
      nowPlaying: {
        info: {
          songArtists = [],
          albumArtists = [],
        },
      },
    } = getState();

    dispatch(clearRelatedAlbums());

    const artistIds =
      songArtists
        .concat(albumArtists)
        .map(artist => artist.id);

    const uniqueArtistIds = new Set(artistIds);
    uniqueArtistIds.forEach(id => {
      dispatch(fetchArtistAlbums(id));
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
          albumId: currentAlbumId,
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

      if (currentAlbumId !== albumId) {
        dispatch(fetchRelatedAlbums());
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
