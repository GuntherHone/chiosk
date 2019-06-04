import React from "react";
import Asset from "./Asset";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

const Container = styled.div``;
const Title = styled.h3`
  padding: 8px;
  margin: 0px;
`;

const AssetList = styled.div`
  padding: 8px;
  margin: 0px;
`;

export default ({ assets, doDelete, doEdit, doReorder }) => {
  const dragEnd = ({ destination, source, draggableId }) => {
    if (!destination) {
      return;
    }
    doReorder(source,destination);
  };

  return (
    <Container>
      <Title>Active Assets</Title>
      <DragDropContext onDragEnd={dragEnd}>
        <Droppable droppableId="assetList">
          {provided => (
            <AssetList
              innerRef={provided.innerRef}
              {...provided.droppableProps}
            >
              {assets.map((asset, index) => (
                <Asset
                  asset={asset}
                  key={asset._id}
                  doDelete={doDelete}
                  doEdit={doEdit}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </AssetList>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};
