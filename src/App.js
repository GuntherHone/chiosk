import React, { Component } from "react";
import "./App.css";

const ERROR_DISPLAY_TIME_MS = 10000;

class App extends Component {
  state = { assets: [], error: undefined };

  componentDidMount() {
    fetch("/api/getAllAssets")
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw { status: res.status, message: res.statusText };
        }
      })
      .then(assets => {
        this.setState({ assets });
      })
      .catch(({ status, message }) => {
        this.showError(`HTTP response error: ${status}: ${message}`);
      });
  }

  showError = message => {
    this.setState({ error: message });
    setTimeout(
      () => this.setState({ error: undefined }),
      ERROR_DISPLAY_TIME_MS
    );
  };

  render() {
    return (
      <div className="App">
        {this.state.error && (
          <div class="App-ErrorMesssage">{this.state.error}</div>
        )}
      </div>
    );
  }
}

export default App;
