///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

const styles = (theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '32px',
    height: 'auto',
    boxShadow: theme.shadows[6],
  },
  displayName: {
    marginLeft: '10px',
  },
});

function UserAvatar({
  displayName,
  thumbnailSrc,
  classes,
  className,
}) {
  return (
    <div className={`${className} ${classes.root}`}>
      <Avatar
        title={displayName}
        alt={displayName}
        src={thumbnailSrc}
        className={classes.avatar}
      />
      <Typography className={classes.displayName}>
        {displayName}
      </Typography>
    </div>
  );
}

UserAvatar.propTypes = {
  displayName: PropTypes.string.isRequired,
  thumbnailSrc: PropTypes.string.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

UserAvatar.defaultProps = {
  className: '',
};

export default withStyles(styles)(UserAvatar);
