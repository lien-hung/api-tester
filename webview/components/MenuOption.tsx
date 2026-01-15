import React from "react";
import styled from "styled-components";
import { IMenuOptionProps } from "./type";

const MenuOption = ({
  children,
  currentOption,
  menuOption,
}: IMenuOptionProps) => {
  return (
    <MenuOptionWrapper primary={currentOption === menuOption}>
      {children}
    </MenuOptionWrapper>
  );
};

const MenuOptionWrapper = styled.div<{ primary: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  padding: ${(props) =>
    props.primary ? "0 0.2rem 0.4rem 0.2rem" : "0 0.2rem 0.6rem 0.2rem"};
  border-bottom: ${(props) =>
    props.primary ? "0.2rem solid var(--vscode-button-background)" : "none"};
  opacity: ${(props) => (props.primary ? "1" : "0.45")};

  h3 {
    font-size: 1.15rem;
    font-weight: 400;
    cursor: pointer;
  }
`;

export default MenuOption;
