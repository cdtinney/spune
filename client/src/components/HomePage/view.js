///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

//////////////////////////
// Internal dependencies//
//////////////////////////

import TopAppBar from '../TopAppBar';
import SongCard from './components/SongCard';
import NowPlayingPoller from './components/NowPlayingPoller';

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
      songTitle: PropTypes.string,
      albumName: PropTypes.string,
      albumImageUrl: PropTypes.string,
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
        albumName,
        albumImageUrl,
      },
    } = this.props;
    
    return (
      <div className={classes.root}>
        <NowPlayingPoller />
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
              albumName={albumName}
              albumImageUrl={albumImageUrl}
            />
          }
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
