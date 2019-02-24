///////////////////////////
// External dependencies //
///////////////////////////

import axios from 'axios';
import { push } from 'connected-react-router';

////////////
// Types  //
////////////

export const FETCH_AUTH_USER_REQ =
  'AUTH/FETCH_AUTH_USER_REQ';
export const FETCH_AUTH_USER_SUCCESS =
  'AUTH/FETCH_AUTH_USER_SUCCESS';
export const FETCH_AUTH_USER_FAILURE =
  'AUTH/FETCH_AUTH_USER_FAILURE';

//////////////////////
// Action creators  //
//////////////////////

export function fetchAuthUserReq() {
  return {
    type: FETCH_AUTH_USER_REQ,
  };
}

export function fetchAuthUserSuccess(profile) {
  return {
    type: FETCH_AUTH_USER_SUCCESS,
    payload: {
      profile,
    },
  };
}

export function fetchAuthUserFailure(error) {
  return {
    type: FETCH_AUTH_USER_FAILURE,
    payload: new Error(error),
    error: true,
  };
}
  
////////////
// Thunks //
////////////

export function loginUser() {
  // It would be better to dispatch an action to change the location,
  // but `connected-react-router` seems to only allow for change the fragment.
  // An authorization fragment will not be routed/proxied to the API.
  // So, we can manually change the URL for now.
  window.location.href = '/api/auth/spotify';
}

export function fetchAuthUser() {
  return function fetchAuthUserThunk(dispatch) {
    dispatch(fetchAuthUserReq());

    return axios.get('/api/auth')
      .then(response =>
        // The request can still be successful with no user returned.
        // In this case, default to `null`.
        dispatch(fetchAuthUserSuccess(response.data.user || null)))
      .catch(error =>
        dispatch(fetchAuthUserFailure(error)));
  };
}
