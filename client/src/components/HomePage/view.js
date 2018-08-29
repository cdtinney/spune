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
import SongCard from './components/SongCard';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
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
    user: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      userName: PropTypes.string,
      userImageUrl: PropTypes.string,
    }).isRequired,
    nowPlaying: PropTypes.shape({
      artistName: PropTypes.string,
      songTitle: PropTypes.string,
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
  };

  //////////////////////
  // Lifecycle methods//
  //////////////////////

  componentDidMount() {
    this.props.onLoad();
  }

  ////////////////////
  // Render methods //
  ////////////////////

  render() {
    const {
      classes,
      user: {
        userName,
        userImageUrl,
      },
      nowPlaying: {
        artistName,
        songTitle,
      },
    } = this.props;
    
    return (
      <div className={classes.root}>
        <TopAppBar
          title="spune"
          userName={userName}
          userImageUrl={userImageUrl}
        />
        <div className={classes.content}>
          { artistName && songTitle &&
            <SongCard
              artistName={artistName}
              songTitle={songTitle}
            />
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
