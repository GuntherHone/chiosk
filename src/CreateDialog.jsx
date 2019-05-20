import React from "react";
import Modal from "./component/Modal";
import Button from "./component/Button";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

class CreateDialog extends React.Component {
  state = { settings: { name: "", urlPrefix: "https://", url: "" } };

  handleChange = key => event =>
    this.setState({
      settings: { ...this.state.settings, [key]: event.target.value }
    });

  onConfirm = () => {
    let url = this.state.settings.urlPrefix + this.state.settings.url;
    this.props.onConfirm({ ...this.state.settings, url });
  };

  render() {
    return (
      <Modal title="Create new Asset">
        <form>
          <div>
            <input
              type="text"
              placeholder="Description"
              value={this.state.settings.description}
              onChange={this.handleChange("description")}
            />
          </div>
          <div>
            <select onChange={this.handleChange("urlPrefix")}>
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>
            <input
              type="text"
              autoCapitalize="none"
              placeholder="URL"
              value={this.state.settings.url}
              onChange={this.handleChange("url")}
            />
            <input
              type="text"
              placeholder="time in ms"
              value={this.state.time_ms}
              onChange={this.handleChange("time_ms")}
            />
          </div>
        </form>
        <Flex>
          <Button onClick={this.onConfirm}>OK</Button>
          <Button onClick={this.props.onCancel}>Cancel</Button>
        </Flex>
      </Modal>
    );
  }
}

export default CreateDialog;
