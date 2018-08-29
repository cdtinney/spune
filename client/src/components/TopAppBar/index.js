///////////////////////////
// External dependencies //
///////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

//////////////////////////
// Internal dependencies//
//////////////////////////

import IconAvatar from './components/IconAvatar';

const styles = {
  flex: {
    flexGrow: 1,
  },
};

function TopAppBar(props) {
  const {
    title,
    userName,
    userImageUrl,
    classes,
  } = props;
  
  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            { title }
          </Typography>
          { userName &&
            <IconAvatar
              alt={userName}
              src={userImageUrl}
            />
          }
        </Toolbar>
      </AppBar>
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
