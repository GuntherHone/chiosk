import React from "react";
import Modal from "./component/Modal";
import Button from "./component/Button";
import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px;
`;

const Label = styled.label`
  display: inline-block;
  width: 100px;
`;

const Input = styled.input.attrs({
  type: "text"
})`
  padding: 5px;
  border-radius: 4px;
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
            <Label for="description">Description:</Label>
            <Input
              type="text"
              id="description"
              value={this.state.settings.description}
              onChange={this.handleChange("description")}
            />
          </div>
          <div>
            <Label for="url">URL:</Label>
            <select onChange={this.handleChange("urlPrefix")}>
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </select>
            <Input
              type="text"
              autoCapitalize="none"
              id="URL"
              value={this.state.settings.url}
              onChange={this.handleChange("url")}
            />
          </div>
          <Label for="time">Time (ms):</Label>
          <Input
            type="text"
            id="time"
            value={this.state.time_ms}
            onChange={this.handleChange("time_ms")}
          />
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
