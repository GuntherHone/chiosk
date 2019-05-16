import React, { Component } from "react";
import "./App.css";
import "boxicons/css/boxicons.min.css";
import styled from "styled-components";
import AssetDisplay from "./AssetDisplay";

const ERROR_DISPLAY_TIME_MS = 10000;

const Button = styled.button`
  color: white;
  padding: 5px;
  background-color: teal;
`;

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

  getAssets = () => {
    fetch("/api/getAllAssets")
      .then(this.checkResponse)
      .then(reply => this.setState({ ...reply }));
  };

  componentDidMount() {
    this.getAssets();
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
        <header className="App-Header">
          <h1 className="App-Title">
            <i className="bx bx-tv" />
            Chiosk
          </h1>
        </header>
        {this.state.error && (
          <div class="App-ErrorMesssage">{this.state.error}</div>
        )}
        <Button onClick={this.doAction("previous")}>Previous</Button>
        {this.state.displayState === "playing" ? (
          <Button onClick={this.doAction("pause")}>Pause</Button>
        ) : this.state.displayState === "paused" ? (
          <Button onClick={this.doAction("play")}>Play</Button>
        ) : (
          <Button disabled>Play</Button>
        )}
        <Button onClick={this.doAction("next")}>Next</Button>
        <table>
          {this.state.assets.map(asset => (
            <AssetDisplay asset={asset} doUpdate={this.getAssets}/>
          ))}
        </table>
      </div>
    );
  }
}

export default App;
