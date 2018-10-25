import {
  SET_TOKENS,
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_NOW_PLAYING_REQUEST,
  FETCH_NOW_PLAYING_SUCCESS,
  CLEAR_RELATED_ALBUMS,
  FETCH_RELATED_ARTIST_ALBUMS_REQUEST,
  FETCH_RELATED_ARTIST_ALBUMS_SUCCESS,
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
      interval: 3000, // MS
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
    relatedAlbums: {
      byArtist: {},
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
            ...state.nowPlaying.request,
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
            ...state.nowPlaying.request,
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
          relatedAlbums: {
            byArtist: {},
          },
        },
      };
    }

    case FETCH_RELATED_ARTIST_ALBUMS_REQUEST: {
      const {
        payload: {
          artistId,
        },
      } = action;

      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          relatedAlbums: {
            ...state.nowPlaying.relatedAlbums,
            byArtist: {
              ...state.nowPlaying.relatedAlbums.byArtist,
              [artistId]: {
                loading: true,
                albums: [],
              }
            },
          },
        },
      };
    }

    case FETCH_RELATED_ARTIST_ALBUMS_SUCCESS: {
      const {
        payload: {
          artistId,
          albums,
        },
      } = action;

      return {
        ...state,
        nowPlaying: {
          ...state.nowPlaying,
          relatedAlbums: {
            ...state.nowPlaying.relatedAlbums,
            byArtist: {
              ...state.nowPlaying.relatedAlbums.byArtist,
              [artistId]: {
                loading: false,
                albums: ((state.nowPlaying.relatedAlbums.byArtist[artistId] || {})
                  .albums || [])
                    .concat(albums),
              },
            },
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