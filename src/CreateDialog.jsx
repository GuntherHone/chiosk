import React from "react";
import Modal from "./component/Modal";
import Button from "./component/Button";
import styled from "styled-components";
import parseUri from "./parseUri";

const Flex = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  border-top: 1px solid #ccc;
`;

const Label = styled.label`
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 15px;
`;

const Input = styled.input.attrs({
  type: "text"
})`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1;
`;

const Select = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const FormItem = styled.div`
  margin-bottom: 20px;
  width: 500px;
  display: flex;
`;

class CreateDialog extends React.Component {
  state = {
    settings: { description: "", urlPrefix: "https://", url: "", time_ms: 0 }
  };

  handleChange = key => event =>
    this.setState({
      settings: { ...this.state.settings, [key]: event.target.value }
    });

  onConfirm = () => {
    const url = this.state.settings.urlPrefix + this.state.settings.url;
    let confirmData = { ...this.state.settings, url };
    delete confirmData.urlPrefix;

    this.props.onConfirm(confirmData);
  };

  componentDidMount = () => {
    const uri = parseUri(this.props.initialData.url);
    uri.protocol = !uri.protocol.length ? "https" : uri.protocol;

    this.setState({
      settings: {
        ...this.props.initialData,
        url: `${uri.host}${uri.port ? `:${uri.port}` : ""}${uri.path}`,
        urlPrefix: uri.protocol + "://"
      }
    });
  };

  render() {
    return (
      <Modal
        title={this.state.settings._id ? "Edit Asset" : "Create new Asset"}
      >
        <form>
          <FormItem>
            <Label for="description">Description</Label>
            <Input
              type="text"
              id="description"
              value={this.state.settings.description}
              onChange={this.handleChange("description")}
            />
          </FormItem>
          <FormItem>
            <Label for="url">URL</Label>
            <Select
              onChange={this.handleChange("urlPrefix")}
              value={this.state.settings.urlPrefix}
            >
              <option value="https://">https://</option>
              <option value="http://">http://</option>
            </Select>
            <Input
              type="text"
              autoCapitalize="none"
              id="URL"
              value={this.state.settings.url}
              onChange={this.handleChange("url")}
            />
          </FormItem>
          <FormItem>
            <Label for="time">Time (ms)</Label>
            <Input
              type="text"
              id="time"
              value={this.state.settings.time_ms}
              onChange={this.handleChange("time_ms")}
            />
          </FormItem>
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
