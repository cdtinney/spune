///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

const styles = {
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    background:
      'radial-gradient(ellipse at center, rgba(88, 0, 88, 0.9) 0%, rgba(4, 0, 33, 0.95) 100%, rgba(0,0,0,1) 50%)',
  },
};

export function ColorOverlay(props) {
  const {
    classes,
  } = props;

  return (
    <div className={classes.root}></div>
  );
}

export default withStyles(styles)(ColorOverlay);
