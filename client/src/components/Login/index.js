///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
  },
  icon: {
    marginRight: '10px',
  },
};

/**
 * Provides a button for logging in/connecting to
 * the user's Spotify account.
 */
export function Login(props) {
  const {
    classes,
  } = props;
  
  // TODO Refactor href to Redux
  return (
    <div className={classes.root}>
      <Button
        color="primary"
        variant="contained"
        href="/api/auth/spotify"
      >
        <FontAwesomeIcon
          icon={faSpotify}
          size="lg"
          className={classes.icon}
        />
        LOG IN WITH SPOTIFY
      </Button>
    </div>
  );
}

export default withStyles(styles)(Login);
