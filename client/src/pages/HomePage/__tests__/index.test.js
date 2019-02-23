import React from 'react';
import ReactDOM from 'react-dom';
import HomePageView from '../view';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HomePageView
      displayLoadingIcon={false}
      displayError={false}
      displayName={false}
      displayLogin={false}
      loginUser={() => {}}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
