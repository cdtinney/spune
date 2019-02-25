///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  icon: {
    marginRight: '10px',
  },
};

export function SpotifyLoginButton(props) {
  const {
    classes,
    onClick,
  } = props;
  return (
    <Button
      color="primary"
      variant="contained"
      onClick={onClick}
    >
      <FontAwesomeIcon
        icon={faSpotify}
        size="lg"
        className={classes.icon}
      />
      LOG IN WITH SPOTIFY
    </Button>
  );
}

SpotifyLoginButton.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(SpotifyLoginButton);
