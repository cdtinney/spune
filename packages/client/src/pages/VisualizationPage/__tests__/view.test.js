import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from "react-redux";
import configureStore from 'redux-mock-store';
import LoadingScreen from '../../../components/LoadingScreen';
import FullscreenButton from '../components/FullscreenButton';
import { VisualizationPageView } from '../view';

const middlewares = [];
const mockStore = configureStore(middlewares);

describe('VisualizationPageView', () => {
  function makeDefaultProps(overrides) {
    return {
      classes: {
        root: {},
      },
      user: {
        loading: false,
      },
      nowPlaying: {},
      ui: {
        loading: false,
        fullscreen: false,
      },
      help: {
        repoUrl: 'foo',
      },
      onLoad: () => {},
      logoutUser: () => {},
      setFullscreen: () => {},
      ...overrides,
    };
  }

  it('renders not in fullscreen when no song is provided', () => {
    shallow(
      <VisualizationPageView
        {...makeDefaultProps()}
      />,
    );
  });

  it('renders not in fullscreen when a song is provided', () => {
    shallow(
      <VisualizationPageView
        {...makeDefaultProps()}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
      />,
    );
  });

  it('renders in fullscreen when no song is provided', () => {
    shallow(
      <VisualizationPageView
        {...makeDefaultProps()}
        ui={{
          loading: false,
          fullscreen: true,
        }}
      />,
    );
  });

  it('renders in fullscreen when a song is provided', () => {
    shallow(
      <VisualizationPageView
        {...makeDefaultProps()}
        user={{
          loading: false,
        }}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
          initialRequestFinished: true,
        }}
        ui={{
          loading: false,
          fullscreen: true,
        }}
      />,
    );
  });

  it('calls setFullscreen when the full screen button is clicked', () => {
    const setFullscreenMock = jest.fn();
    const wrapper = shallow(
      <VisualizationPageView
        {...makeDefaultProps()}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
          initialRequestFinished: true,
        }}
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
        {...makeDefaultProps()}
        nowPlaying={{
          songTitle: 'bar',
          songArtistName: 'foo',
        }}
        setFullscreen={setFullscreenMock}
      />,
    );

    wrapper.instance().handleFullscreen();
    expect(setFullscreenMock).toHaveBeenCalledWith(true);
  });

  it('displays a message indicating no song is playing when no song is provided and the request has finished', () => {
    const store = mockStore({
      spotify: {
        nowPlaying: {
          request: {
            // Required for NowPlayingPoller (a connected child node)
            loading: false,
            interval: 3000,
          },
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <VisualizationPageView
          {...makeDefaultProps()}
          nowPlaying={{
            songTitle: null,
            songArtistName: null,
          }}
        />
      </Provider>
    );

    expect(wrapper.text()).toContain('No song playing');
  });

  it('does not display a message indicating no song is playing when no song is provided and the request has not finished', () => {
    const store = mockStore({
      spotify: {
        nowPlaying: {
          request: {
            // Required for NowPlayingPoller (a connected child node)
            loading: true,
            interval: 3000,
          },
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <VisualizationPageView
          {...makeDefaultProps()}
          nowPlaying={{
            songTitle: null,
            songArtistName: null,
          }}
          ui={{
            loading: true,
            fullscreen: false,
          }}
        />
      </Provider>
    );

    expect(wrapper.text()).not.toContain('No song playing');
  });

  it('displays a loading screen when the page is still loading', () => {
    const store = mockStore({
      spotify: {
        nowPlaying: {
          request: {
            // Required for NowPlayingPoller (a connected child node)
            loading: true,
            interval: 3000,
          },
        },
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <VisualizationPageView
          {...makeDefaultProps()}
          nowPlaying={{
            songTitle: null,
            songArtistName: null,
          }}
          ui={{
            loading: true,
            fullscreen: false,
          }}
        />
      </Provider>
    );

    expect(wrapper.find(LoadingScreen)).toHaveLength(1);

  });
});
