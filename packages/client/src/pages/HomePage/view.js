///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import LoadingScreen from '../../components/LoadingScreen';
import SpotifyLoginButton from './components/SpotifyLoginButton';
import SpuneLogo from '../../assets/spune_logo.png';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  logo: {
    maxWidth: '200px',
    marginBottom: '2em',
  },
  contentContainer: {
    height: '100px',
  },
};

function HomePageView(props) {
  const {
    classes,
    displayLoadingIcon,
    displayName,
    nameToDisplay,
    displayError,
    errorToDisplay,
    displayLogin,
    loginUser,
  } = props;

  function Content() {
    if (displayLoadingIcon) {
      return <LoadingScreen />;
    }

    if (displayName) {
      return (
        <Typography>
          {`Logged in as ${nameToDisplay}.`}
        </Typography>
      );
    }

    if (displayError) {
      return (
        <Typography color="error">
          {`Failed to load (${errorToDisplay}). Try refreshing.`}
        </Typography>
      );
    }

    if (displayLogin) {
      return <SpotifyLoginButton onClick={loginUser} />;
    }

    // This shouldn't happen...
    return null;
  }

  return (
    <div className={classes.root}>
      <img
        alt="Spune Logo"
        src={SpuneLogo}
        className={classes.logo}
      />
      <div className={classes.contentContainer}>
        <Content />
      </div>
    </div>
  );
}

HomePageView.propTypes = {
  classes: PropTypes.object.isRequired,
  displayLoadingIcon: PropTypes.bool.isRequired,
  displayError: PropTypes.bool.isRequired,
  errorToDisplay: PropTypes.string,
  displayName: PropTypes.bool.isRequired,
  nameToDisplay: PropTypes.string,
  displayLogin: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
};

export default withStyles(styles)(HomePageView);
