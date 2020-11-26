///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

///////////////////////////
// Internal dependencies //
///////////////////////////

import * as spotifyActions from '../../actions/spotify';
import * as uiActions from '../../actions/ui';
import * as userActions from '../../actions/user';

import * as nowPlayingSelectors from '../../selectors/nowPlayingSelectors';

import VisualizationPage from './view';

function mapStateToProps(state) {
  const {
    user: {
      request: {
        errored: userErrored,
        lastUpdated: userLastUpdated,
      },
      profile: {
        spotifyId,
        displayName,
        photos,
      },
    },
    spotify: {
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

  // TODO Need to convert all to selectors
  return {
    user: {
      loading: userReqPendingOrInitialLoad,
      // There is an open bug with the API where some users don't have
      // the `display_name` property set. Fallback to ID.
      //
      // More info: https://github.com/spotify/web-api/issues/371
      userName: displayName || spotifyId,
      userImageUrl: photos[0],
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
    help: {
      repoUrl: 'https://github.com/cdtinney/spune',
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLoad() {
      dispatch(spotifyActions.fetchNowPlayingInfo());
    },

    logoutUser() {
      // This should be an action, I know.
      userActions.logoutUser();
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
