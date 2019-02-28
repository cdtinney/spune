import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import PrivateRoute from '../PrivateRoute';

describe('PrivateRoute', () => {
  it('returns a route to the component when authenticated is true', () => {
    const FooComponent = () => <div />;
    const wrapper = mount(
      <Router>
        <Switch>
          <PrivateRoute
            authenticated={true}
            component={FooComponent}
          />
        </Switch>
      </Router>
    );
    expect(wrapper.find(FooComponent)).toHaveLength(1);
  });

  it('returns a redirect component when authenticated is false', () => {
    const FooComponent = () => <div />;
    const wrapper = mount(
      <Router>
        <Switch>
          <PrivateRoute
            authenticated={false}
            component={FooComponent}
          />
        </Switch>
      </Router>
    );
    expect(wrapper.find(FooComponent)).toHaveLength(0);
    expect(wrapper.find(Redirect)).toHaveLength(1);
  });
});
