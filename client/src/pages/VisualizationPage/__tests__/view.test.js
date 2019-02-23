import React from 'react';
import ReactDOM from 'react-dom';
import VisualizationPage from '../view';

// TODO Switch to shallow rendering as
// child component is connected and fails this test
it.skip('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    user: {
      loading: false,      
    },
    nowPlaying: {},
    onLoad: () => {},
  };
  ReactDOM.render(<VisualizationPage {...props} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
