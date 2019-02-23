///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import SpotifyLoginButton from './components/SpotifyLoginButton';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import SpuneLogo from '../../assets/spune_logo.png';

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  logo: {
    maxWidth: '200px',
  }
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
      return <CircularProgress color="primary" />;
    }

    if (displayName) {
      return (
        <Typography>
          {`Logged in as ${nameToDisplay}. Redirecting...`}
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

    return (
      <img
        alt="Spune Logo"
        src={SpuneLogo}
        className={classes.logo}
      />
    );
  }
  
  return (
    <div className={classes.root}>
      <Content />
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
