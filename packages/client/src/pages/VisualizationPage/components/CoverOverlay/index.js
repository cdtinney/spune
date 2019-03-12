///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

///////////////////////////
// Internal dependencies //
///////////////////////////

import './styles.css';

const styles = {
  root: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    background: 'linear-gradient(-45deg, '
      + '#EE7752, '
      + '#E73C7E, '
      + '#23A6D5, '
      + '#23D5AB, '
      + '#361fe2, '
      + '#0eb71c, '
      + '#0eb71c, '
      + '#361fe2, '
      + '#23D5AB, '
      + '#23A6D5, '
      + '#E73C7E, '
      + '#EE7752) ',
    opacity: 0.75,
    backgroundSize: '1200% 1200%',
    // 12 colours * 15 seconds to "focus" on each color =
    // 180 seconds of animation.
    animation: 'move-background 180s ease infinite alternate',
  },
  darken: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(' +
      'ellipse at center,' +
        'rgba(0, 0, 0, 0.3) 0,' +
        'rgba(0, 0, 0, 0.75) 75%,' +
        'rgba(0, 0, 0, 1) 100%)',
  },
};

function ColorOverlay({
  classes,
}) {
  return (
    <div className={classes.root}>
      <div className={classes.darken} />
    </div>
  );
}

ColorOverlay.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    darken: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(ColorOverlay);
