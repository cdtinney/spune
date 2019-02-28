import React from 'react';
import createRouterContext from 'react-router-test-context'
import { shallow } from 'enzyme';
import ConnectedApp, { App } from '../App';

describe('App', () => {
  describe('unconnected', () => {
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
  });

  describe('connected', () => {
    it('renders without crashing', () => {
      shallow(
        <ConnectedApp
          history={{}}
        />
      );
    });
  });
});
