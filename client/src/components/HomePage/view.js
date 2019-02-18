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
import NowPlayingPoller from './components/NowPlayingPoller';
import SongCard from './components/SongCard';
import NowPlayingAlbumGrid from './components/NowPlayingAlbumGrid';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    // Justifies children in bottom right.
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
      songArtistName: PropTypes.string,
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
        songTitle,
        songArtistName,
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
        { songArtistName && songTitle &&
          <div className={classes.content}>
            <SongCard
              artistName={songArtistName}
              songTitle={songTitle}
              albumName={albumName}
              albumImageUrl={albumImageUrl}
            />
            <NowPlayingAlbumGrid />
          </div>
        }
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
