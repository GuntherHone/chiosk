import React, { Component } from "react";
import "boxicons/css/boxicons.min.css";
import styled from "styled-components";
import AssetDisplay from "./AssetDisplay";
import Button from "./component/Button";
import CreateDialog from "./CreateDialog";

const ERROR_DISPLAY_TIME_MS = 10000;

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AppHeader = styled.header`
  margin-top: 0px;
  background-color: teal;
`;

const AppTitle = styled.h1`
  color: white;
`;

const AppErrorMesssage = styled.div`
  background-color: rgb(98, 0, 0);
  color: rgb(200, 0, 0);
  border: 1px solid red;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
`;

class App extends Component {
  state = {
    assets: [],
    error: undefined,
    displayState: undefined,
    showAddDialog: false
  };

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

  doDelete = id => {
    fetch(`/api/delete/${id}`, { method: "POST" })
      .then(this.checkResponse)
      .then(this.getAssets)
      .catch(({ status, message }) =>
        this.showError(`doDelete(${id})`, status, message)
      );
  };

  doCreate = asset => {
    fetch(`/api/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(asset)
    })
      .then(this.checkResponse)
      .then(this.getAssets)
      .catch(({ status, message }) =>
        this.showError(`doCreate(${JSON.stringify(asset)})`, status, message)
      );
    this.setState({ showAddDialog: false });
  };

  cancelSettings = () => this.setState({ showAddDialog: false });

  render() {
    return (
      <div className="App">
        <AppHeader>
          <AppTitle>
            <i className="bx bx-tv" />
            Chiosk
          </AppTitle>
        </AppHeader>
        {this.state.error && (
          <AppErrorMesssage>{this.state.error}</AppErrorMesssage>
        )}
        <Flex>
          <Button onClick={this.doAction("previous")}>Previous</Button>
          {this.state.displayState === "playing" ? (
            <Button onClick={this.doAction("pause")}>Pause</Button>
          ) : this.state.displayState === "paused" ? (
            <Button onClick={this.doAction("play")}>Play</Button>
          ) : (
            <Button disabled>Play</Button>
          )}
          <Button onClick={this.doAction("next")}>Next</Button>
        </Flex>
        <Button onClick={() => this.setState({ showAddDialog: true })}>
          Add
        </Button>
        <table>
          {this.state.assets.map(asset => (
            <AssetDisplay asset={asset} doDelete={this.doDelete} />
          ))}
        </table>
        {this.state.showAddDialog ? (
          <CreateDialog
            onConfirm={this.doCreate}
            onCancel={this.cancelSettings}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
