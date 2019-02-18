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
    boxShadow: '4px 4px 5px 0px rgba(0,0,0,0.29)',
  },
};

function IconAvatar(props) {
  const {
    alt,
    title,
    src,
    classes,
  } = props;

  return (
    <div>
      <Avatar
        title={title}
        alt={alt}
        src={src}
        className={classes.avatar}
      />
    </div>
  );
}

IconAvatar.propTypes = {
  title: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IconAvatar);
