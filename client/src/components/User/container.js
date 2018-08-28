///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

//////////////////////////
// Internal dependencies//
//////////////////////////

// TODO Add shared folders to resolve paths after ejecting
import * as spotifyActions from '../../actions/spotify';

import User from './view';

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
    displayName,
    avatarImageUrl,
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
)(User);
