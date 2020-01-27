import React from "react";
import styled from "styled-components";

const RemoveableItemStyle = styled.div`
display: inline-flex;
font-size: 0.75em;
background: #eee;
border-radius: 4px;
border: 1px solid #ccc;
padding: 2px 8px;
align-items: center;
margin: 2px;
`;

export default props => (
<RemoveableItemStyle>
  {props.children}
  <span
    style={{ cursor: "pointer", paddingLeft: "8px", fontSize: "1.5em" }}
    onClick={props.onRemove}
  >
    &times;
  </span>
</RemoveableItemStyle>
);
