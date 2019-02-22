///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212121',
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
  
  return (
    <div className={classes.root}>
      <Button color="primary" variant="contained" href="/api/auth/spotify">
        Login with Spotify
      </Button>
    </div>
  );
}

export default withStyles(styles)(Login);
