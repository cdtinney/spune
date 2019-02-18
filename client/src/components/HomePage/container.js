///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

///////////////////////////
// Internal dependencies //
///////////////////////////

import * as spotifyActions from '../../actions/spotify';

import HomePage from './view';

function mapStateToProps(state) {
  const {
    spotify: {
      user: {
        request: {
          loading: userLoading,
          lastUpdated: userLastUpdated,
        },
        info: {
          id,
          displayName,
          avatarImageUrl,
        },
      },
      nowPlaying: {
        info: {
          songTitle,
          songArtists,
          albumName,
          albumImageUrl,
        },
      },
    },
  } = state;

  return {
    user: {
      loading: userLoading || userLastUpdated === null || false,
      // There is an open bug with the API where some users don't have
      // the `display_name` property set. Fallback to ID.
      // 
      // More info: https://github.com/spotify/web-api/issues/371
      userName: displayName || id,
      userImageUrl: avatarImageUrl,
    },
    nowPlaying: {
      songTitle,
      songArtistName: (songArtists || []).map(artist => artist.name).join(', '),
      albumName,
      albumImageUrl,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoad() {
      dispatch(spotifyActions.getMyInfo());
      dispatch(spotifyActions.getNowPlaying());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
