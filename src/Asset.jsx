import React from "react";
import styled from "styled-components";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  margin: 8px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items:center;
`;

const Title = styled.h2`
  font-weight: bold;
  margin: 0;
`;

const DetailDisplay = styled.div`
  flex: 1;
`;
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Details = styled.div`
  &:before {
    font-weight: bold;
    font-size:14px;
    content: "${props => props.label}: ";
  }
  font-size:14px;
  margin: 8px;
`;

export default ({ asset, index, doDelete, doEdit }) => (
  <Draggable draggableId={asset._id} index={index}>
    {provided => (
      <Container {...provided.draggableProps} innerRef={provided.innerRef}>
        <span {...provided.dragHandleProps} style={{ flex: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M4 6H20V8H4zM4 11H20V13H4zM4 16H20V18H4z" />
          </svg>
        </span>
        <DetailDisplay>
          <Title>{asset.description}</Title>
          <Details label="URL">{asset.url}</Details>
          <Details label="Time (ms)">{asset.time_ms}</Details>
        </DetailDisplay>
        <Controls>
          <EditButton onClick={() => doEdit(asset._id)} />
          <DeleteButton onClick={() => doDelete(asset._id)} />
        </Controls>
      </Container>
    )}
  </Draggable>
);
