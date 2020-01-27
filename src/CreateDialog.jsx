import React from "react";
import Modal from "./component/Modal";
import Button from "./component/Button";
import RemoveableItem from "./component/RemoveableItem";
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
  align-items: baseline;
`;

const DropArea = styled.div`
  border: 2px dashed #ccc;
  border-radius: 20px;
  width: 480px;
  margin: 0px 20px 20px 20px;
  background: ${props => (props.dragging ? "#eee" : "none")};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

class CreateDialog extends React.Component {
  state = {
    settings: { description: "", urlPrefix: "https://", url: "", time_ms: 0 },
    dragging: false,
    filesToUpload: []
  };

  handleChange = key => event =>
    this.setState({
      settings: { ...this.state.settings, [key]: event.target.value }
    });

  onConfirm = () => {
    let confirmData = {};

    if (this.state.filesToUpload.length) {
      confirmData = {
        ...this.state.settings,
        filesToUpload: this.state.filesToUpload
      };
      delete confirmData.urlPrefix;
      delete confirmData.url;
    } else {
      const url = this.state.settings.urlPrefix + this.state.settings.url;
      confirmData = { ...this.state.settings, url };
      delete confirmData.urlPrefix;
    }

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

  setDragging = highlighted => event => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ dragging: highlighted });
  };

  handleDrop = event => {
    this.setDragging(false)(event);
    this.setState({ filesToUpload: [...event.dataTransfer.files] });
  };

  handleUploadButton = event => {
    this.setState({ filesToUpload: [...event.target.files] });
  };

  removeFileAtIndex = index => () => {
    let copyOfFiles = this.state.filesToUpload;
    copyOfFiles.splice(index, 1);
    this.setState({ filesToUpload: copyOfFiles });
  };

  render() {
    return (
      <Modal
        title={this.state.settings._id ? "Edit Asset" : "Create new Asset"}
      >
        <div style={{ display: "flex" }}>
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
            {this.state.filesToUpload.length ? (
              <FormItem>
                <Label for="files">Files</Label>
                <span id="files">
                  {this.state.filesToUpload.map((file, index) => (
                    <RemoveableItem onRemove={this.removeFileAtIndex(index)}>
                      {file.name}
                    </RemoveableItem>
                  ))}
                </span>
              </FormItem>
            ) : (
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
            )}
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
          <DropArea
            onDragEnter={this.setDragging(true)}
            onDragOver={this.setDragging(true)}
            onDragLeave={this.setDragging(false)}
            onDrop={this.handleDrop}
            dragging={this.state.dragging}
          >
            <form action="">
              <p>Drop files here to upload...</p>
              <input
                type="file"
                id="fileInput"
                multiple
                accept="image/*"
                onChange={this.handleUploadButton}
                style={{ display: "none" }}
              />
              <label
                htmlFor="fileInput"
                style={{
                  display: "inline-block",
                  padding: "10px",
                  background: "#ccc",
                  cursor: "pointer",
                  borderRadius: "5px",
                  border: "1px solid #ccc"
                }}
              >
                Select files for upload
              </label>
            </form>
          </DropArea>
        </div>
        <Flex>
          <Button onClick={this.onConfirm}>OK</Button>
          <Button onClick={this.props.onCancel}>Cancel</Button>
        </Flex>
      </Modal>
    );
  }
}

export default CreateDialog;
