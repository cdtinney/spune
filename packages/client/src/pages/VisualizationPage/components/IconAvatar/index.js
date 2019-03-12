///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = (theme) => ({
  avatar: {
    boxShadow: theme.shadows[6],
  },
});

function IconAvatar({
  alt,
  title,
  src,
  classes,
  className,
}) {
  return (
    <div className={className}>
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
  className: PropTypes.string,
};

IconAvatar.defaultProps = {
  className: undefined,
};

export default withStyles(styles)(IconAvatar);
