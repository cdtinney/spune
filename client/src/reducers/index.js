import {
    SET_TOKENS,
    FETCH_USER_INFO_REQUEST,
    FETCH_USER_INFO_SUCCESS,
    FETCH_USER_INFO_FAILURE,
  } from '../actions/spotify';
  
  const initialState = {
    accessToken: null,
    refreshToken: null,
    user: {
      loading: false,
      country: null,
      display_name: null,
      email: null,
      external_urls: {},
      followers: {},
      href: null,
      id: null,
      images: [],
      product: null,
      type: null,
      uri: null,
    },
  };
  
  export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_TOKENS: {
            const {
                accessToken,
                refreshToken,
            } = action;

            return {
                ...state,
                accessToken,
                refreshToken,
            };
        }
    
        case FETCH_USER_INFO_REQUEST: {
            return {
                ...state,
                user: {
                    ...state.user,
                    loading: true,
                },
            };
        }
    
        case FETCH_USER_INFO_SUCCESS: {
            const { data } = action;
            
            return {
                ...state,
                user: {
                    ...state.user,
                    ...data,
                    loading: false,
                    updated: Date.now(),
                },
            };
        }
        
        case FETCH_USER_INFO_FAILURE:
        default: {
            return state;
        }
    }
  }