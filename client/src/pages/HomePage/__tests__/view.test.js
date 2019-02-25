import React from 'react';
import { mount } from 'enzyme';
import CircularProgress from '@material-ui/core/CircularProgress';
import HomePageView from '../view';
import SpotifyLoginButton from '../components/SpotifyLoginButton';

describe('HomePageView', () => {
  it('renders without crashing', () => {
    mount(
      <HomePageView
        displayLoadingIcon={false}
        displayError={false}
        displayName={false}
        displayLogin={false}
        loginUser={() => {}}
      />,
    );
  });

  it('renders a loading icon when displayLoadingIcon is set to true', () => {
    const wrapper = mount(
      <HomePageView
        displayLoadingIcon={true}
        displayError={false}
        displayName={false}
        displayLogin={false}
        loginUser={() => {}}
      />,
    );
    
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
  });

  it('displays the users name when displayName is set to true', () => {
    const wrapper = mount(
      <HomePageView
        displayLoadingIcon={false}
        displayError={false}
        displayName={true}
        nameToDisplay="foo"
        displayLogin={false}
        loginUser={() => {}}
      />,
    );
    
    expect(wrapper.contains('Logged in as foo.'));
  });

  it('displays an error message when displayError is set to true', () => {
    const wrapper = mount(
      <HomePageView
        displayLoadingIcon={false}
        displayError={true}
        errorToDisplay="foo"
        displayName={false}
        displayLogin={false}
        loginUser={() => {}}
      />,
    );
    
    expect(wrapper.contains('Failed to load (foo). Try refreshing.'));
  });

  it('displays a login button when displayLogin is set to true', () => {
    const wrapper = mount(
      <HomePageView
        displayLoadingIcon={false}
        displayError={false}
        displayName={false}
        displayLogin={true}
        loginUser={() => {}}
      />,
    );
    
    expect(wrapper.find(SpotifyLoginButton)).toHaveLength(1);
  });
});
