///////////////////////////
// External dependencies //
///////////////////////////

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Non-UI component.
 *
 * Polls the endpoint for updating the currently
 * played track on a specified interval.
 */
export default class NowPlayingPoller extends Component {
  static propTypes = {
    /**
     * Whether or not the currently playing track is being loaded.
     */
    loading: PropTypes.bool.isRequired,
    /**
     * Interval for updating, in milliseconds.
     */
    interval: PropTypes.number.isRequired,
    /**
     * Updates the currently playing track.
     */
    updateNowPlaying: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.startPoll();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  startPoll() {
    const {
      interval,
      updateNowPlaying,
    } = this.props;

    this.timeout = setInterval(updateNowPlaying, interval);
  }

  render() {
    return null;
  }
}
