import React from "react";
import Button from "./component/Button";

export default ({ asset, doDelete }) => (
  <tr>
    <td>{asset.description}</td>
    <td>{asset.url}</td>
    <td>{asset.time_ms}</td>
    <td>
      <Button onClick={() => doDelete(asset._id)}>Delete</Button>
    </td>
  </tr>
);
