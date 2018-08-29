///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

import TopAppBar from '../TopAppBar';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

/**
 * Displays the user's profile image and display name.
 */
export class HomePage extends Component {
  static propTypes = {
    loadUser: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    userName: PropTypes.string,
    userImageUrl: PropTypes.string,
  };

  //////////////////////
  // Lifecycle methods//
  //////////////////////

  componentDidMount() {
    this.props.loadUser();
  }

  ////////////////////
  // Render methods //
  ////////////////////

  render() {
    const {
      classes,
      loading,
      userName,
      userImageUrl,
    } = this.props;
    
    return (
      <div className={classes.root}>
        <TopAppBar
          title="spune"
          userName={userName}
          userImageUrl={userImageUrl}
        />
        <div className={classes.content}>
          { loading ?
            <CircularProgress /> :
            <h2>{`Logged in as ${userName || '... nobody?'}`}</h2>
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
