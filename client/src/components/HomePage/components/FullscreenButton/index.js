////////////////////////////
// External dependencies  //
////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

////////////////////////////
// Internal dependencies  //
////////////////////////////

import FullscreenIcon from './assets/fullscreen_light.png';

const styles = {
  root: {
    // Nothing for now.
  },
};

function FullscreenButton(props) {
  const {
    onClick,
    classes,
    className,
  } = props;

  return (
    <img
      src={FullscreenIcon}
      alt="fullscreen"
      width={32}
      onClick={onClick}
      className={`${classes.root} ${className}`}
    ></img>
  );
}

FullscreenButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default withStyles(styles)(FullscreenButton);
