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
        displayName,
        avatarImageUrl,
      },
    },
  } = state;

  return {
    loading: loading || lastUpdated === null,
    userName: displayName,
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
