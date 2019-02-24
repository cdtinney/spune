////////////////////////////
// External dependencies  //
////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExpandArrowsAlt } from '@fortawesome/free-solid-svg-icons'
import { withStyles } from '@material-ui/core/styles';

////////////////////////////
// Internal dependencies  //
////////////////////////////

const styles = (theme) => ({
  icon: {
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[6],
    '&:hover': {
      color: theme.palette.text.secondary,
    },
  },
});

function FullscreenButton(props) {
  const {
    onClick,
    classes,
    className,
  } = props;

  return (
    <div className={className}>
      <FontAwesomeIcon
        icon={faExpandArrowsAlt}
        size="1x"
        inverse
        className={classes.icon}
        onClick={onClick}
      />
    </div>
  );
}

FullscreenButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

FullscreenButton.defaultProps = {
  className: undefined,
};

export default withStyles(styles)(FullscreenButton);
