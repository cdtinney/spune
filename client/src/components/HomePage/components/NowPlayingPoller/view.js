///////////////////////////
// External dependencies //
///////////////////////////

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Non-UI component.
 *
 * Polls the endpoint for updating the currently
 * played track every three seconds.
 */
export default class NowPlayingPoller extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    interval: PropTypes.number.isRequired,
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
