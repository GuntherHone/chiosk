import React from "react";
import styled from "styled-components";

const Background = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  width: 80%;
  border-radius: 4px;
`;

export default props => (
  <Background>
    <ModalContent>
      <h2>{props.title}</h2>
      {props.children}
    </ModalContent>
  </Background>
);
