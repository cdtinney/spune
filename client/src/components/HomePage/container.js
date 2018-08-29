///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

//////////////////////////
// Internal dependencies//
//////////////////////////

import * as spotifyActions from '../../actions/spotify';

import HomePage from './view';

function mapStateToProps(state) {
  const {
    user: {
      request: {
        loading,
        lastUpdated,
      },
      info: {
        id,
        displayName,
        avatarImageUrl,
      },
    },
  } = state;

  return {
    loading: loading || lastUpdated === null,
    // There is an open bug with the API where some users don't have
    // the `display_name` property set. Fallback to ID.
    // 
    // More info: https://github.com/spotify/web-api/issues/371
    userName: displayName || id,
    userImageUrl: avatarImageUrl,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    loadUser() {
      // Props injected by react-router.
      const {
        match: {
          params: {
            accessToken,
            refreshToken,
          },
        },
      } = ownProps;

      dispatch(spotifyActions.setTokens({ accessToken, refreshToken }));
      dispatch(spotifyActions.getMyInfo());
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
