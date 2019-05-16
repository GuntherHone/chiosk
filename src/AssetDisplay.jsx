import React from "react";

function deleteAsset(id, doUpdate) {
  fetch(`/api/delete/${id}`, { method: "POST" }).then(_ => doUpdate());
}

export default ({ asset, doUpdate }) => (
  <tr>
    <td>{asset.description}</td>
    <td>{asset.url}</td>
    <td>{asset.time_ms}</td>
    <td>
      <button onClick={() => deleteAsset(asset._id, doUpdate)}>Delete</button>
    </td>
  </tr>
);
