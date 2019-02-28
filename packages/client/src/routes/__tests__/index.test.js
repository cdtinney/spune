import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

import Routes from '../';
import HomePage from '../../pages/HomePage';
import VisualizationPage from '../../pages/VisualizationPage';

// Connected components can be mocked to avoid having
// to provide state, etc.
jest.mock('../../pages/HomePage');
jest.mock('../../pages/VisualizationPage');

const mockStore = configureMockStore();
const store = mockStore({});

describe('Routes', () => {
  it('should render when authenticated', () => {
    mount(
      <Provider store={store}>
        <Router>
          <Routes authenticated={true} />
        </Router>
      </Provider>
    );
  });
  
  it('should render when not authenticated', () => {
    mount(
      <Provider store={store}>
        <Router>
          <Routes authenticated={false} />
        </Router>
      </Provider>
    );
  });
});

