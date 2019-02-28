import React from 'react';
import { shallow } from 'enzyme';
import { VisualizationPageView } from '../view';
import FullscreenButton from '../components/FullscreenButton';

describe('VisualizationPageView', () => {
  it('renders not in fullscreen when no song is provided', () => {
    shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{}}
        ui={{
          fullscreen: false,
        }}
        onLoad={() => {}}
        setFullscreen={() => {}}
      />,
    );
  });

  it('renders not in fullscreen when a song is provided', () => {
    shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
        ui={{
          fullscreen: false,
        }}
        onLoad={() => {}}
        setFullscreen={() => {}}
      />,
    );
  });

  it('renders in fullscreen when no song is provided', () => {
    shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{}}
        ui={{
          fullscreen: true,
        }}
        onLoad={() => {}}
        setFullscreen={() => {}}
      />,
    );
  });

  it('renders in fullscreen when a song is provided', () => {
    shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
        ui={{
          fullscreen: true,
        }}
        onLoad={() => {}}
        setFullscreen={() => {}}
      />,
    );
  });

  it('calls setFullscreen when the full screen button is clicked', () => {
    const setFullscreenMock = jest.fn();
    const wrapper = shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
        ui={{
          fullscreen: false,
        }}
        onLoad={() => {}}
        setFullscreen={setFullscreenMock}
      />,
    );

    wrapper.find(FullscreenButton).simulate('click');
    expect(setFullscreenMock).toHaveBeenCalled();
  });
  
  it('calls setFullscreen with true when no argument is provided', () => {
    const setFullscreenMock = jest.fn();
    const wrapper = shallow(
      <VisualizationPageView
        classes={{
          root: {},
        }}
        user={{
          loading: false,      
        }}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
        ui={{
          fullscreen: false,
        }}
        onLoad={() => {}}
        setFullscreen={setFullscreenMock}
      />,
    );

    wrapper.instance().handleFullscreen();
    expect(setFullscreenMock).toHaveBeenCalledWith(true);
  });
});
