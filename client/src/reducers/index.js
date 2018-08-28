import {
  SET_TOKENS,
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAILURE,
} from '../actions/spotify';

const initialState = {
  tokens: {
    accessToken: null,
    refreshToken: null,
  },
  user: {
    request: {
      loading: false,
      lastUpdated: null,
    },
    info: {
      displayName: null,
      imageUrl: null,
    },
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKENS: {
      const {
        payload: {
          accessToken,
          refreshToken,
        },
      } = action;
      
      return {
        ...state,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    }
    
    case FETCH_USER_INFO_REQUEST: {
      return {
        ...state,
        user: {
          ...state.user,
          request: {
            loading: true,
            lastUpdated: null,
          },
        },
      };
    }
    
    case FETCH_USER_INFO_SUCCESS: {
      const { 
        payload: {
          info,
        },
      } = action;
      
      return {
        ...state,
        user: {
          ...state.user,
          request: {
            loading: false,
            lastUpdated: Date.now(),
          },
          info: {
            ...info,
          },
        },
      };
    }
    
    case FETCH_USER_INFO_FAILURE:
    default: {
      return state;
    }
  }
}