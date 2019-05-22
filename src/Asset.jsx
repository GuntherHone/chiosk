import React from "react";
import Button from "./component/Button";
import styled from "styled-components";

const Container = styled.div`
  border: 1px solid lightgrey;
  margin: 8px;
  padding: 10px;
  border-radius: 4px;
  display:flex;
  justify-content: space-between;
`;

const Title = styled.h2`
  font-weight: bold;
  margin: 0;
`;

const DetailDisplay = styled.div``;
const Controls = styled.div``;

const Details = styled.div`
  &:before {
    font-weight: bold;
    font-size:14px;
    content: "${props => props.label}: ";
  }
  font-size:14px;
  margin: 8px;
`;

export default ({ asset, doDelete }) => (
  <Container>
    <DetailDisplay>
      <Title>{asset.description}</Title>
      <Details label="URL">{asset.url}</Details>
      <Details label="Time (ms)">{asset.time_ms}</Details>
    </DetailDisplay>
    <Controls>
      <Button onClick={() => doDelete(asset._id)}>Delete</Button>
    </Controls>
  </Container>
);
