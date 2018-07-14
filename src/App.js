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
    fetch("/api/getAllAssets")
      .then(this.checkResponse)
      .then(reply => this.setState({ ...reply }));
  }

  doAction = action => () => {
    fetch(`/api/${action}`, { method: "POST" })
      .then(this.checkResponse)
      .then(_ => this.getDisplayState())
      .catch(({ status, message }) =>
        this.showError(`doAction(${action})`, status, message)
      );
  };

  render() {
    return (
      <div className="App">
        {this.state.error && (
          <div class="App-ErrorMesssage">{this.state.error}</div>
        )}
        <button onClick={this.doAction("previous")}>Previous</button>
        {this.state.displayState === "playing" ? (
          <button onClick={this.doAction("pause")}>Pause</button>
        ) : this.state.displayState === "paused" ? (
          <button onClick={this.doAction("play")}>Play</button>
        ) : (
          <button disabled>Play</button>
        )}
        <button onClick={this.doAction("next")}>Next</button>
        {this.state.assets.map(asset => <h2>{asset.description}</h2>)}
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    );
  }
}

export default App;
