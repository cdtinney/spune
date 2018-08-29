///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
      <Button variant="contained" href="/api/login">
        Connect to Spotify
      </Button>
    </div>
  );
}

export default withStyles(styles)(Login);
