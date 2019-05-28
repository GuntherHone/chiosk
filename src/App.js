import React, { Component } from "react";
import "boxicons/css/boxicons.min.css";
import styled from "styled-components";
import Asset from "./Asset";
import Button from "./component/Button";
import CreateDialog from "./CreateDialog";
import BackButton from "./BackButton";
import ForwardButton from "./ForwardButton";
import PlayPauseButton from "./PlayPauseButton";

const ERROR_DISPLAY_TIME_MS = 10000;

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`;

const AppHeader = styled.header`
  margin: 0px 0px 10px 0px;
  background-color: teal;
  display: flex;
  justify-content: center;
`;

const AppTitle = styled.h1`
  color: white;
  margin: 0;
  padding: 8px;
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
    showAddDialog: false,
    editData: { description: "", url: "", time_ms: 5000 }
  };

  checkResponse = res => {
    if (res.status === 200) {
      return res.json();
    } else {
      let err = { status: res.status, message: res.statusText };
      throw err;
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

  doCreateOrUpdate = asset => {
    if (!asset._id) {
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
    } else {
      fetch(`/api/update/${asset._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset)
      })
        .then(this.checkResponse)
        .then(this.getAssets)
        .catch(({ status, message }) =>
          this.showError(`doUpdate(${JSON.stringify(asset)})`, status, message)
        );
    }
    this.setState({ showAddDialog: false });
  };

  showEditDialog = id => {
    this.setState({
      showAddDialog: true,
      editData: this.state.assets.find(asset => asset._id === id)
    });
  };

  cancelSettings = () => this.setState({ showAddDialog: false });

  render() {
    return (
      <div className="App">
        <AppHeader>
          <AppTitle>Chiosk</AppTitle>
        </AppHeader>
        {this.state.error && (
          <AppErrorMesssage>{this.state.error}</AppErrorMesssage>
        )}
        <Flex>
          <BackButton onClick={this.doAction("previous")} />
          <PlayPauseButton
            onClick={
              this.state.displayState === "playing"
                ? this.doAction("pause")
                : this.doAction("play")
            }
            playing={this.state.displayState === "playing"}
          />
          <ForwardButton onClick={this.doAction("next")} />
        </Flex>
        <Button
          onClick={() =>
            this.setState({
              showAddDialog: true,
              editData: { description: "", url: "", time_ms: 5000 }
            })
          }
        >
          Add
        </Button>
        {this.state.assets.map(asset => (
          <Asset
            asset={asset}
            doDelete={this.doDelete}
            doEdit={this.showEditDialog}
          />
        ))}

        {this.state.showAddDialog ? (
          <CreateDialog
            onConfirm={this.doCreateOrUpdate}
            onCancel={this.cancelSettings}
            initialData={this.state.editData}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
