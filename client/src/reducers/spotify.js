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
  FETCH_NOW_PLAYING_REQUEST,
  FETCH_NOW_PLAYING_SUCCESS,
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
      request: {
        errored: false,
        loading: false,
        error: undefined,
      },
      byArtist: {},
    },
  },
};

export default function spotify(state = initialState, action) {
  switch (action.type) {

    case FETCH_USER_INFO_REQUEST: {
      return update(state, {
        user: {
          request: {
            $merge: {
              loading: true,
              lastUpdated: null,
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
            },
          },
          info: {
            $set: info,
          },
        },
      });
    }
    
    case FETCH_NOW_PLAYING_REQUEST: {
      return update(state, {
        nowPlaying: {
          request: {
            $merge: {
              loading: true,
              lastUpdated: null,
            },
          },
        },
      });
    }
    
    case FETCH_NOW_PLAYING_SUCCESS: {
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
            },
          },
          info: {
            $set: info,
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
              },
            },
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE: {
      const {
        error,
      } = action.payload;
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $set: {
              byArtist: {},
              request: {
                loading: false,
                errored: true,
                error,
              },
            },
          },
        },
      });
    }

    // TODO Handle failure actions

    default: {
      return state;
    }
  }
}