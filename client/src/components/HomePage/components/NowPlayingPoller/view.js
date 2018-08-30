///////////////////////////
// External dependencies //
///////////////////////////

import { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Polls the endpoint for updating the currently
 * played track every three seconds.
 */
export default class NowPlayingPoller extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    updateNowPlaying: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.startPoll();
  }

  componentWillUnmount() {
    clearInterval(this.timeout);
  }

  startPoll() {    
    this.timeout = setInterval(() =>
      this.props.updateNowPlaying(), 3000);
  }

  render() {
    return null;
  }
}
