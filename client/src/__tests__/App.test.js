import createRouterContext from 'react-router-test-context'
import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';

it('renders without crashing', () => {
  const context = createRouterContext();
  shallow(
    <App
      userAuthenticated={false}
      fetchAuthUser={() => {}}
    />, {
      context,
    },
  );
});
