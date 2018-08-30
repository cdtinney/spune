import {
  SET_TOKENS,
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_NOW_PLAYING_REQUEST,
  FETCH_NOW_PLAYING_SUCCESS,
  CLEAR_RELATED_ALBUMS,
  ADD_RELATED_ALBUMS,
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
      songId: null,
      songTitle: null,
      songArtists: null,
      artistName: null,
      albumId: null,
      albumName: null,
      albumImageUrL: null,
      albumArtists: null,
    },
    relatedAlbums: [],
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

    case CLEAR_RELATED_ALBUMS: {
      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          relatedAlbums: [],
        },
      };
    }

    case ADD_RELATED_ALBUMS: {
      const {
        payload: {
          albums,
        },
      } = action;

      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          relatedAlbums: state.nowPlaying.relatedAlbums.concat(albums),
        },
      };
    }

    // TODO Handle failure actions

    default: {
      return state;
    }
  }
}