///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

///////////////////////////
// Internal dependencies //
///////////////////////////

import * as spotifyActions from '../../actions/spotify';
import * as uiActions from '../../actions/ui';

import * as nowPlayingSelectors from '../../selectors/nowPlayingSelectors';

import VisualizationPage from './view';

function mapStateToProps(state) {
  const {
    spotify: {
      user: {
        request: {
          errored: userErrored,
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
          albumName,
          albumImageUrl,
        },
        request: {
          lastUpdated: nowPlayingLastUpdated,
          errored: nowPlayingErrored,
        },
      },
    },
    ui: {
      fullscreen,
    },
  } = state;

  const userReqPendingOrInitialLoad =
    userLastUpdated === null && !userErrored;
  const nowPlayingReqPendingOrInitialLoad =
    nowPlayingLastUpdated === null && !nowPlayingErrored;

  return {
    user: {
      loading: userReqPendingOrInitialLoad,
      // There is an open bug with the API where some users don't have
      // the `display_name` property set. Fallback to ID.
      //
      // More info: https://github.com/spotify/web-api/issues/371
      userName: displayName || id,
      userImageUrl: avatarImageUrl,
    },
    nowPlaying: {
      songTitle,
      songArtistName:
        nowPlayingSelectors.nowPlayingArtistNamesSelector(state),
      albumName,
      albumImageUrl,
    },
    ui: {
      loading: userReqPendingOrInitialLoad || nowPlayingReqPendingOrInitialLoad,
      fullscreen,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoad() {
      dispatch(spotifyActions.fetchMyInfo());
      dispatch(spotifyActions.fetchNowPlayingInfo());
    },

    setFullscreen(fullscreen) {
      dispatch(uiActions.setFullscreen(fullscreen));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VisualizationPage);
