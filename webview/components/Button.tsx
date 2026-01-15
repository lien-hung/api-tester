import React from "react";
import styled from "styled-components";

import { COMMON } from "../constants";
import { IButtonProps, IButtonStyledProps } from "./type";

const Button = ({
  children,
  buttonType,
  buttonStatus,
  primary,
  handleButtonClick,
}: IButtonProps) => {
  return (
    <ButtonWrapper
      primary={primary}
      type={buttonType}
      onClick={handleButtonClick}
      disabled={buttonStatus === COMMON.LOADING}
      className={primary ? "" : "secondary"}
    >
      {children}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button<IButtonStyledProps>`
  width: 8rem;
  margin-left: ${(props) => (props.primary ? "0" : "2rem")};
  font-size: ${(props) => (props.primary ? "1.2rem" : "1rem")};
  font-weight: ${(props) => (props.primary ? "500" : "normal")};
  transition: background-color 0.2s ease-in-out;
`;

export default Button;