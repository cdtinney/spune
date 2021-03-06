///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

///////////////////////////
// Internal dependencies //
///////////////////////////

import * as spotifyActions from '../../../../actions/spotify';
import NowPlayingPoller from './view';

function mapStateToProps(state) {
  const {
    spotify: {
      nowPlaying: {
        request: {
          loading,
          interval,
        },
      },
    },
  } = state;

  return {
    loading,
    interval,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateNowPlaying() {
      dispatch(spotifyActions.fetchNowPlayingInfo());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NowPlayingPoller);
