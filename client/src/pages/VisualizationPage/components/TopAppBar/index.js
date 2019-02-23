///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

import IconAvatar from './components/IconAvatar';

const styles = {
  root: {
    position: 'absolute',
    display: 'flex',
    width: '100%',
    zIndex: 100,
  },
  iconContainer: {
    marginLeft: 'auto',
  },
};

function TopAppBar(props) {
  const {
    userName,
    userImageUrl,
    classes,
  } = props;
  
  return (
    <div className={classes.root}>
      { userName &&
        <div className={classes.iconContainer}>
          <IconAvatar
            title={userName}
            alt={userName}
            src={userImageUrl}
          />
        </div>
      }
    </div>
  );
}

TopAppBar.propTypes = {
  title: PropTypes.string.isRequired,
  userName: PropTypes.string,
  userImageUrl: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopAppBar);
