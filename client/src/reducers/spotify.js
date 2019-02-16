////////////////////////////
// External dependencies  //
////////////////////////////

import update from 'immutability-helper';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import {
  SET_TOKENS,
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

export default function spotify(state = initialState, action) {
  switch (action.type) {
    case SET_TOKENS: {
      const {
        payload: {
          accessToken,
          refreshToken,
        },
      } = action;

      return update(state, {
        tokens: {
          $set: {
            accessToken,
            refreshToken,
          },
        },
      });
    }
    
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
              byArtist: {},
            },
          },
        },
      });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST: {
      return state;
      // return update(state, {
      //   nowPlaying: {
      //     relatedAlbums: {
      //       byArtist: {
      //         $merge: {
      //           [artistId]: {
      //             loading: true,
      //             albums: [],
      //           },
      //         },
      //       },
      //     },
      //   },
      // });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS: {
      return state;
      // return update(state, {
      //   nowPlaying: {
      //     relatedAlbums: {
      //       byArtist: {
      //         [artistId]: {
      //           loading: {
      //             $set: false,
      //           },
      //           albums: {
      //             $push: albums,
      //           },
      //         },
      //       },
      //     },
      //   },
      // });
    }

    case FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE: {
      return state;
      // return update(state, {
      //   nowPlaying: {
      //     relatedArtists: {
      //       byArtist: {
      //         $merge: {
      //           [artistId]: {
      //             loading: true,
      //             artists: [],
      //           },
      //         },
      //       },
      //     },
      //   },
      // });
    }

    // TODO Handle failure actions

    default: {
      return state;
    }
  }
}