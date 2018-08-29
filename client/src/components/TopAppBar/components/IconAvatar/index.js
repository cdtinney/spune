///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  avatar: {
    margin: 10,
  },
};

function IconAvatar(props) {
  const {
    alt,
    src,
    classes,
  } = props;

  return (
    <div>
      <Avatar alt={alt} src={src} className={classes.avatar} />
    </div>
  );
}

IconAvatar.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconAvatar);
