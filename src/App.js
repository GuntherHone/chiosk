import React, { Component } from "react";
import styled from "styled-components";
import Button from "./component/Button";
import CreateDialog from "./CreateDialog";
import BackButton from "./BackButton";
import ForwardButton from "./ForwardButton";
import PlayPauseButton from "./PlayPauseButton";
import AssetList from "./AssetList";

const ERROR_DISPLAY_TIME_MS = 10000;

const Flex = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Header = styled.header`
  margin: 0px 0px 10px 0px;
  background-color: teal;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: white;
  margin: 0;
  padding: 8px;
`;

const ErrorMesssage = styled.div`
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
    fetch(asset._id ? `/api/update/${asset._id}` : `/api/create`, {
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

  showEditDialog = id => {
    this.setState({
      showAddDialog: true,
      editData: this.state.assets.find(asset => asset._id === id)
    });
  };

  cancelSettings = () => this.setState({ showAddDialog: false });

  doReorder = (source, destination) => {
    let assetsCopy = [...this.state.assets];
    const [tempAsset] = assetsCopy.splice(source.index, 1);
    assetsCopy.splice(destination.index, 0, tempAsset);
    this.setState({ assets: assetsCopy });

    fetch(`/api/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: source.index,
        destination: destination.index
      })
    })
      .then(this.checkResponse)
      .then(this.getAssets)
      .catch(({ status, message }) =>
        this.showError(
          `doReorder(source=${source.index},destination=${destination.index})`,
          status,
          message
        )
      );
  };

  toggleDevTools = () => {
    fetch(`/api/toggledevtools`, { method: "POST" })
      .then(this.checkResponse)
      .catch(({ status, message }) =>
        this.showError(`toggledevtools`, status, message)
      );
  };

  render() {
    return (
      <div>
        <Header>
          <span>&nbsp;</span>
          <Title>Chiosk</Title>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            onClick={this.toggleDevTools}
            style={{ cursor: "pointer" }}
          >
            <path d="M2.344,15.271l2,3.46c0.276,0.478,0.888,0.642,1.366,0.365l1.396-0.806c0.58,0.457,1.221,0.832,1.895,1.112V21 c0,0.552,0.447,1,1,1h4c0.553,0,1-0.448,1-1v-1.598c0.674-0.28,1.314-0.655,1.895-1.112l1.396,0.806 c0.477,0.275,1.091,0.11,1.366-0.365l2-3.46c0.275-0.476,0.11-1.091-0.365-1.366l-1.372-0.793C19.973,12.743,20,12.371,20,12 s-0.027-0.743-0.081-1.112l1.372-0.793c0.476-0.275,0.641-0.89,0.365-1.366l-2-3.46c-0.276-0.478-0.888-0.642-1.366-0.365 l-1.396,0.806C16.314,5.253,15.674,4.877,15,4.598V3c0-0.552-0.447-1-1-1h-4C9.447,2,9,2.448,9,3v1.598 c-0.674,0.28-1.314,0.655-1.895,1.112L5.71,4.904C5.231,4.627,4.62,4.791,4.344,5.269l-2,3.46c-0.275,0.476-0.11,1.091,0.365,1.366 l1.372,0.793C4.027,11.257,4,11.629,4,12s0.027,0.743,0.081,1.112l-1.372,0.793C2.233,14.18,2.068,14.795,2.344,15.271z M12,8 c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S9.794,8,12,8z" />
          </svg>
        </Header>
        {this.state.error && <ErrorMesssage>{this.state.error}</ErrorMesssage>}
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
        <AssetList
          assets={this.state.assets}
          doDelete={this.doDelete}
          doEdit={this.showEditDialog}
          doReorder={this.doReorder}
        />

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
