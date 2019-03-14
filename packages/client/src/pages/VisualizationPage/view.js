///////////////////////////
// External dependencies //
///////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import equal from 'fast-deep-equal';
import Typography from '@material-ui/core/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { withStyles } from '@material-ui/core/styles';
import Fullscreen from 'react-full-screen';

///////////////////////////
// Internal dependencies //
///////////////////////////

import LoadingScreen from '../../components/LoadingScreen';
import UserAvatar from './components/UserAvatar';
import UserMenu from './components/UserMenu';
import ColorOverlay from './components/CoverOverlay';
import NowPlayingPoller from './components/NowPlayingPoller';
import SongCard from './components/SongCard';
import AlbumGrid from './components/AlbumGrid';
import FullscreenButton from './components/FullscreenButton';

import './style.css';

const styles = theme => ({
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
    backgroundColor: theme.palette.background.paper,
  },
  gitHubIcon: {
    position: 'absolute',
    left: '30px',
    top: '35px',
    zIndex: 100,
    color: theme.palette.text.primary,
    '&:hover': {
      color: theme.palette.text.secondary,
    },
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
  userContainer: {
    position: 'absolute',
    top: '30px',
    right: '30px',
    zIndex: 100,
    display: 'flex',
  },
});

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
    help: PropTypes.shape({
      repoUrl: PropTypes.string.isRequired,
    }).isRequired,
    onLoad: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
    setFullscreen: PropTypes.func.isRequired,
  };

  ///////////////////////
  // Lifecycle methods //
  ///////////////////////

  constructor(props) {
    super(props);
    this.handleFullscreen = this.handleFullscreen.bind(this);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  shouldComponentUpdate(nextProps) {
    return !equal(this.props, nextProps);
  }

  //////////////
  // Handlers //
  //////////////

  handleFullscreen(fullscreen = true) {
    this.props.setFullscreen(fullscreen);
  }

  ////////////////////
  // Render methods //
  ////////////////////

  // TODO Extract to connected component
  renderContent() {
    const {
      classes,
      nowPlaying: {
        songTitle,
        songArtistName,
        albumName,
        albumImageUrl,
      },
      ui: {
        loading,
      },
    } = this.props;

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
  }

  render() {
    const {
      classes,
      user: {
        userName,
        userImageUrl,
      },
      ui: {
        loading,
        fullscreen,
      },
      help: {
        repoUrl,
      },
      logoutUser,
    } = this.props;

    return (
      <div className={classes.root}>
        { !loading &&
          <FullscreenButton
            onClick={this.handleFullscreen}
            className={classes.fullscreenButton}
          />
        }
        <Fullscreen
          enabled={fullscreen}
          onChange={this.handleFullscreen}
          className={classes.fullscreenContainer}
        >
          <ColorOverlay />
          { !loading &&
            <React.Fragment>
              { !fullscreen &&
                <a href={repoUrl}>
                  <FontAwesomeIcon
                    icon={faGithub}
                    inverse
                    size="1x"
                    className={classes.gitHubIcon}
                  />
                </a>
              }
              <NowPlayingPoller />
              { userName && userImageUrl &&
                <div className={classes.userContainer}>
                  <UserAvatar
                    displayName={userName}
                    thumbnailSrc={userImageUrl}
                  />
                  <UserMenu
                    handlers={{
                      onLogout: logoutUser,
                    }}
                  />
                </div>
              }
            </React.Fragment>
          }
          <div className={classes.content}>
            {this.renderContent()}
          </div>
        </Fullscreen>
      </div>
    );
  }
}


export default withStyles(styles)(VisualizationPageView);
