import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    response: '',
  };

  componentDidMount() {
    this.callApi()
      .then(res => this.setState({
        response: res.express,
      }))
      .catch(console.error);
  }

  callApi = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) {
      throw new Error(body.message);
    }
    
    return body;
  }

  render() {
    return (
      <div className="app">
        <header className="app__header">
          <h1 className="app__header__title">
            szune
          </h1>
        </header>
        <p className="app__intro">
          {this.state.response}
        </p>
      </div>
    );
  }
}

export default App;
