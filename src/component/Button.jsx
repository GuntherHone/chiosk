import styled from "styled-components";

export default styled.button`
  color: ${props => props.theme.primary};
  background-color: white;
  padding: 8px 16px;
  font-size: 16px;
  border: 1px solid ${props => props.theme.primary};
  border-radius: 5px;
`;
