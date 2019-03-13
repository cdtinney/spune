///////////////////////////
// External dependencies //
///////////////////////////

import axios from 'axios';

////////////
// Types  //
////////////

export const types = {
  FETCH_USER_AUTH_REQ:
    'AUTH/FETCH_USER_AUTH_REQ',
  FETCH_USER_AUTH_SUCCESS:
    'AUTH/FETCH_USER_AUTH_SUCCESS',
  FETCH_USER_AUTH_FAILURE:
    'AUTH/FETCH_USER_AUTH_FAILURE',
  LOGOUT_USER: 'LOGOUT_USER',
};

//////////////////////
// Action creators  //
//////////////////////

export function fetchUserAuthReq() {
  return {
    type: types.FETCH_USER_AUTH_REQ,
  };
}

export function fetchUserAuthSuccess(profile) {
  return {
    type: types.FETCH_USER_AUTH_SUCCESS,
    payload: {
      profile,
    },
  };
}

export function fetchUserAuthFailure(error) {
  return {
    type: types.FETCH_USER_AUTH_FAILURE,
    payload: error,
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
  window.location.assign('api/auth/spotify');
}

export function logoutUser() {
  // ... same as above ...
  window.location.assign('/api/auth/user/logout');
}

export function fetchUserAuth() {
  return function fetchUserAuthThunk(dispatch) {
    dispatch(fetchUserAuthReq());

    return axios.get('/api/auth/user')
      .then(response =>
        // The request can still be successful with no user returned.
        // In this case, default to `null` (instead of `undefined`).
        dispatch(fetchUserAuthSuccess(response.data.user || null)))
      .catch(error =>
        dispatch(fetchUserAuthFailure(error.response.data)));
  };
}
