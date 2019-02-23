///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Fullscreen from 'react-full-screen';

///////////////////////////
// Internal dependencies //
///////////////////////////

import TopAppBar from './components/TopAppBar';
import ColorOverlay from './components/CoverOverlay';
import NowPlayingPoller from './components/NowPlayingPoller';
import SongCard from './components/SongCard';
import NowPlayingAlbumGrid from './components/NowPlayingAlbumGrid';
import FullscreenButton from './components/FullscreenButton';

import './style.css';

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
  },
  fullscreenButton: {
    position: 'absolute',
    right: '30px',
    bottom: '30px',
    zIndex: '100',
  },
};

/**
 * Album art visualization page for the user's currently playing track.
 */
export class VisualizationPage extends Component {
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
    ui: PropTypes.shape({
      fullscreen: PropTypes.bool.isRequired,
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
    setFullscreen: PropTypes.func.isRequired,
  };

  //////////////////////
  // Lifecycle methods//
  //////////////////////

  constructor(props) {
    super(props);
    this.handleFullscreen = this.handleFullscreen.bind(this);
  }
  componentDidMount() {
    this.props.onLoad();
  }

  handleFullscreen(fullscreen = true) {
    this.props.setFullscreen(fullscreen);
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
      ui: {
        fullscreen,
      },
    } = this.props;

    const songPlaying = songArtistName && songTitle;
    
    return (
      <div className={classes.root}>
        { songPlaying &&
          <FullscreenButton
            onClick={() => this.handleFullscreen(true)}
            className={classes.fullscreenButton}
          />
        }
        <Fullscreen
          enabled={fullscreen}
          onChange={this.handleFullscreen}
          className={classes.fullscreenContainer}
        >
          <NowPlayingPoller />
          <ColorOverlay />
          <TopAppBar
            title="spune"
            userName={userName}
            userImageUrl={userImageUrl}
          />
          { songPlaying &&
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
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(styles)(VisualizationPage);
