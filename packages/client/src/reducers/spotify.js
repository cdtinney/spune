////////////////////////////
// External dependencies  //
////////////////////////////

import update from 'immutability-helper';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import {
  types,
} from '../actions/spotify';

const initialState = {
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
      byAlbumId: {},
      allAlbumIds: [],
    },
  },
};

/**
 * Handles the `spotify` slice of state.
 *
 * @param {Object} state - Current state.
 * @param {Object} action - Action object.
 */
export default function spotify(state = initialState, action = {}) {
  switch (action.type) {

    case types.FETCH_NOW_PLAYING_INFO_REQUEST: {
      return update(state, {
        nowPlaying: {
          request: {
            $merge: {
              loading: true,
              error: null,
              errored: false,
            },
          },
        },
      });
    }

    case types.FETCH_NOW_PLAYING_INFO_SUCCESS: {
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

    case types.FETCH_NOW_PLAYING_INFO_FAILURE: {
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

    case types.CLEAR_NOW_PLAYING_RELATED_ALBUMS: {
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $set: {
              request: {
                loading: false,
                errored: false,
                error: undefined,
              },
              byAlbumId: {},
              allAlbumIds: [],
            },
          },
        },
      });
    }

    case types.FETCH_NOW_PLAYING_RELATED_ALBUMS_REQUEST: {
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            request: {
              $merge: {
                loading: true,
                error: null,
                errored: false,
              },
            },
          },
        },
      });
    }

    case types.FETCH_NOW_PLAYING_RELATED_ALBUMS_SUCCESS: {
      const {
        albums,
      } = action.payload;

      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $merge: {
              byAlbumId:
                albums.reduce((map, album) => ({
                  ...map,
                  [album.id]: album,
                }), {}),
              allAlbumIds: albums.map(album => album.id),
              request: {
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

    case types.FETCH_NOW_PLAYING_RELATED_ALBUMS_FAILURE: {
      const {
        payload: error,
      } = action;
      return update(state, {
        nowPlaying: {
          relatedAlbums: {
            $set: {
              byAlbumId: {},
              allAlbumIds: [],
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
