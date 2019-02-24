////////////////////////////
// External dependencies  //
////////////////////////////

import update from 'immutability-helper';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import {
  FETCH_USER_INFO_REQUEST,
  FETCH_USER_INFO_SUCCESS,
  FETCH_USER_INFO_FAILURE,
  FETCH_NOW_PLAYING_INFO_REQUEST,
  FETCH_NOW_PLAYING_INFO_SUCCESS,
  FETCH_NOW_PLAYING_INFO_FAILURE,
  CLEAR_NOW_PLAYING_RELATED_ALBUMS,
  FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST,
  FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS,
  FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE,
} from '../actions/spotify';

const initialState = {
  user: {
    request: {
      loading: false,
      lastUpdated: null,
      error: null,
      errored: false,
    },
    info: {
      id: null,
      displayName: null,
      avatarImageUrl: null,
    },
  },
  nowPlaying: {
    request: {
      loading: false,
      lastUpdated: null,
      error: null,
      errored: false,
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
      request: {
        loading: false,
        error: undefined,
        errored: false,
      },
      byArtist: {},
    },
  },
};

export default function spotify(state = initialState, action = {}) {
  switch (action.type) {

    case FETCH_USER_INFO_REQUEST: {
      return update(state, {
        user: {
          request: {
            $merge: {
              loading: true,
              lastUpdated: null,
              error: null,
              errored: false,
            },
          },
        },
      });
    }
    
    case FETCH_USER_INFO_SUCCESS: {
      const { 
        payload: {
          info,
        },
      } = action;

      return update(state, {
        user: {
          request: {
            $merge: {
              loading: false,
              lastUpdated: Date.now(),
              error: null,
              errored: false,
            },
          },
          info: {
            $set: info,
          },
        },
      });
    }

    case FETCH_USER_INFO_FAILURE: {
      const {
        payload: error,
      } = action;

      return update(state, {
        user: {
          request: {
            $merge: {
              loading: false,
              lastUpdated: null,
              error,
              errored: true,
            },
          },
          info: {
            $merge: {
              id: null,
              displayName: null,
              avatarImageUrl: null,
            },
          },
        },
      });
    }
    
    case FETCH_NOW_PLAYING_INFO_REQUEST: {
      return update(state, {
        nowPlaying: {
          request: {
            $merge: {
              loading: true,
              lastUpdated: null,
              error: null,
              errored: false,
            },
          },
        },
      });
    }
    
    case FETCH_NOW_PLAYING_INFO_SUCCESS: {
      const {
        payload: {
          info,
        },
      } = action;

      return update(state, {
        nowPlaying: {
          request: {
            $merge: {
              loading: false,
              lastUpdated: Date.now(),
              error: null,
              errored: false,
            },
          },
          info: {
            $set: info,
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_INFO_FAILURE: {
      const { 
        payload: error,
      } = action;

      return update(state, {
        nowPlaying: {
          request: {
            $merge: {
              loading: false,
              lastUpdated: Date.now(),
              error,
              errored: true,
            },
          },
        },
      });
    }

    case CLEAR_NOW_PLAYING_RELATED_ALBUMS: {
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $set: {
              request: {
                loading: false,
                errored: false,
                error: undefined,
              },
              byArtist: {},
            },
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST: {
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            request: {
              $merge: {
                loading: true,
                lastUpdated: null,
                error: null,
                errored: false,
              },
            },
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS: {
      const {
        albumsByArtist,
      } = action.payload;
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            byArtist: {
              $set: albumsByArtist,
            },
            request: {
              $merge: {
                loading: false,
                lastUpdated: Date.now(),
                error: null,
                errored: false,
              },
            },
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE: {
      const {
        payload: error,
      } = action;
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $set: {
              byArtist: {},
              request: {
                loading: false,
                lastUpdated: null,
                errored: true,
                error,
              },
            },
          },
        },
      });
    }

    default: {
      return state;
    }
  }
}