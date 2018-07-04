import React, { Component } from "react";
import "./App.css";

const ERROR_DISPLAY_TIME_MS = 10000;

class App extends Component {
  state = { assets: [], error: undefined, displayState: undefined };

  checkResponse = res => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw { status: res.status, message: res.statusText };
    }
  };

  getDisplayState = () => {
    fetch("/api/getDisplayState")
      .then(this.checkResponse)
      .then(displayState => this.setState({ displayState }))
      .catch(({ status, message }) =>
        this.showError(
          `getDisplayState:: HTTP response error: ${status}: ${message}`
        )
      );
  };

  componentDidMount() {
    fetch("/api/getAllAssets")
      .then(this.checkResponse)
      .then(assets => this.setState({ assets }))
      .catch(({ status, message }) =>
        this.showError(
          `getAllAssets:: HTTP response error: ${status}: ${message}`
        )
      );
    this.getDisplayState();
  }

  showError = message => {
    this.setState({ error: message });
    setTimeout(
      () => this.setState({ error: undefined }),
      ERROR_DISPLAY_TIME_MS
    );
  };

  pause = () => {
    fetch("/api/pause", { method: "POST" }).then(res => this.getDisplayState());
  };

  play = () => {
    fetch("/api/play", { method: "POST" }).then(res => this.getDisplayState());
  };

  next = () => {
    fetch("/api/next", { method:"POST"})
  }

  render() {
    return (
      <div className="App">
        {this.state.error && (
          <div class="App-ErrorMesssage">{this.state.error}</div>
        )}
        <button onClick={this.next}>Next</button>
        {this.state.displayState === "playing" ? (
          <button onClick={this.pause}>Pause</button>
        ) : this.state.displayState === "paused" ? (
          <button onClick={this.play}>Play</button>
        ) : (
          ""
        )}
        {this.state.assets.map(asset => <h2>{asset.description}</h2>)}
      </div>
    );
  }
}

export default App;
