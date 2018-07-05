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

  showError = (context, code, message) => {
    this.setState({ error: `${context}:: Error ${code}: ${message}` });
    setTimeout(
      () => this.setState({ error: undefined }),
      ERROR_DISPLAY_TIME_MS
    );
  };

  getDisplayState = () => {
    fetch("/api/getDisplayState")
      .then(this.checkResponse)
      .then(displayState => this.setState({ displayState }))
      .catch(({ status, message }) =>
        this.showError("getDisplayState", status, message)
      );
  };

  componentDidMount() {
    Promise.all(
      ["getAllAssets", "getDisplayState"].map(x => fetch("/api/" + x, {}))
    )
      .then(([res1, res2]) => Promise.all([res1.json(), res2.json()]))
      .then(([assets, displayState]) =>
        this.setState({ assets, displayState })
      );
  }

  pause = () => {
    fetch("/api/pause", { method: "POST" }).then(res => this.getDisplayState());
  };

  play = () => {
    fetch("/api/play", { method: "POST" }).then(res => this.getDisplayState());
  };

  next = () => {
    fetch("/api/next", { method: "POST" });
  };

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
