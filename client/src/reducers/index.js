import {
  SET_TOKENS,
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_NOW_PLAYING_REQUEST,
  FETCH_NOW_PLAYING_SUCCESS,
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
  nowPlaying: {
    request: {
      loading: false,
      lastUpdated: null,
    },
    info: {
      artistName: null,
      songTitle: null,
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
    
    case FETCH_NOW_PLAYING_REQUEST: {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          request: {
            loading: true,
            lastUpdated: null,
          },
        },
      };
    }
    
    case FETCH_NOW_PLAYING_SUCCESS: {
      const { 
        payload: {
          info,
        },
      } = action;
      
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
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

    // TODO Handle failure actions

    default: {
      return state;
    }
  }
}