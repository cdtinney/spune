import React from 'react';
import ReactDOM from 'react-dom';
import NowPlayingPoller from '../view';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    loading: false,
    updateNowPlaying: () => {},
  };
  ReactDOM.render(<NowPlayingPoller {...props} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
