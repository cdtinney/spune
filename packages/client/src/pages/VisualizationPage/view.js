///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Fullscreen from 'react-full-screen';

///////////////////////////
// Internal dependencies //
///////////////////////////

import LoadingScreen from '../../components/LoadingScreen';
import TopAppBar from './components/TopAppBar';
import ColorOverlay from './components/CoverOverlay';
import NowPlayingPoller from './components/NowPlayingPoller';
import SongCard from './components/SongCard';
import AlbumGrid from './components/AlbumGrid';
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
    zIndex: 100,
  },
  nothingPlayingContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingScreen: {
    zIndex: 100,
    alignSelf: 'center',
    margin: 'auto 0',
  },
};

/**
 * Album art visualization page for the user's currently playing track.
 */
export class VisualizationPageView extends Component {
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
      loading: PropTypes.bool.isRequired,
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
        loading,
        fullscreen,
      },
    } = this.props;

    return (
      <div className={classes.root}>
        <FullscreenButton
          onClick={() => this.handleFullscreen(true)}
          className={classes.fullscreenButton}
        />
        <Fullscreen
          enabled={fullscreen}
          onChange={this.handleFullscreen}
          className={classes.fullscreenContainer}
        >
          <ColorOverlay />
          { !loading &&
            <React.Fragment>
              <NowPlayingPoller />
              <TopAppBar
                title="spune"
                user={userName && userImageUrl ? {
                  name: userName,
                  imageUrl: userImageUrl,
                } : undefined}
              />
            </React.Fragment>
          }
          <div className={classes.content}>
            {
              (() => {
                if (loading) {
                  return <LoadingScreen className={classes.loadingScreen} />;
                }

                const songPlaying = songArtistName !== null
                  && songTitle !== null;
                if (!songPlaying) {
                  return (
                    <div className={classes.nothingPlayingContainer}>
                      <Typography>
                        {'No song playing. Play something.'}
                      </Typography>
                    </div>
                  );
                }

                return (
                  <React.Fragment>
                    <SongCard
                    artistName={songArtistName}
                      songTitle={songTitle}
                      albumName={albumName}
                      albumImageUrl={albumImageUrl}
                    />
                    <AlbumGrid />
                  </React.Fragment>
                );
              })()
            }
          </div>
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(styles)(VisualizationPageView);
