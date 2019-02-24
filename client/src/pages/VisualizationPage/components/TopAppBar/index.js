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
    user,
    classes,
  } = props;
  
  return (
    <div className={classes.root}>
      { user &&
        <div className={classes.iconContainer}>
          <IconAvatar
            title={user.name}
            alt={user.name}
            src={user.imageUrl}
          />
        </div>
      }
    </div>
  );
}

TopAppBar.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
  }),
  classes: PropTypes.object.isRequired,
};

TopAppBar.defaultProps = {
  user: undefined,
};

export default withStyles(styles)(TopAppBar);
