///////////////////////////
// External dependencies //
///////////////////////////

import { connect } from 'react-redux';

///////////////////////////
// Internal dependencies //
///////////////////////////

import * as userActions from '../../actions/user';
import HomePageView from './view';

function mapStateToProps(state) {
  const {
    user: {
      request: {
        loading,
        lastUpdated,
        errored,
        error,
      },
      profile,
    },
  } = state;

  // TODO Refactor this into an enum with a selector
  const displayLoadingIcon = loading;
  const displayError = !displayLoadingIcon && errored;
  const errorToDisplay = displayError ? error : null;
  const displayName = !displayLoadingIcon && !displayError
    && (profile !== null && profile !== undefined && profile.displayName !== undefined);
  const nameToDisplay = displayName ? profile.displayName : null;
  // Display login only if a request has finished (successfully) and no user is stored.
  const displayLogin = (!loading && lastUpdated !== null) &&
    !displayError && !displayName;

  return {
    displayLoadingIcon,
    displayError,
    errorToDisplay,
    displayName,
    nameToDisplay,
    displayLogin,
  };
}

function mapDispatchToProps() {
  return {
    loginUser: userActions.loginUser,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePageView);
