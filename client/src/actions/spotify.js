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

//////////////
// Creators //
//////////////

export function setTokens({ accessToken, refreshToken }) {
    if (accessToken) {
        spotifyApi.setAccessToken(accessToken);
    }

    return {
        type: SET_TOKENS,
        accessToken,
        refreshToken,
    };
}

export function getMyInfo() {
    return function getMyInfoThunk(dispatch) {
        dispatch({ type: FETCH_USER_INFO_REQUEST });

        spotifyApi.getMe().then((data) => {
            dispatch({
                type: FETCH_USER_INFO_SUCCESS,
                data,
            });
        }).catch((err) => {
            dispatch({
                type: FETCH_USER_INFO_FAILURE,
                error: err,
            });
        });
    };
}