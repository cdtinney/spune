import React from 'react';
import { shallow, mount } from 'enzyme';
import TopAppBar from '..';
import IconAvatar from '../components/IconAvatar';

describe('TopAppBar', () => {
  it('renders without crashing', () => {
    shallow(
      <TopAppBar 
        title="foo"
      />,
    );
  });
    
  it('renders an icon avatar when a username is provided', () => {
    const wrapper = mount(
      <TopAppBar 
        title="foo"
        user={{
          name: 'name',
          imageUrl: 'imageUrl'
        }}
      />,
    );
    
    expect(wrapper.find(IconAvatar)).toHaveLength(1);
  });
});
