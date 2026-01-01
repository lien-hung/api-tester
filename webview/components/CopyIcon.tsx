import React from "react";
import styled from "styled-components";
import { ICopyIconProps } from "./type";
import copyIcon from "../assets/svg/copy-icon.svg";

const CopyIcon = ({ handleClick, value }: ICopyIconProps) => {
  return (
    <CopyIconWrapper>
      <img src={copyIcon} className="copyIcon" onClick={() => handleClick(value)} />
    </CopyIconWrapper>
  );
};

const CopyIconWrapper = styled.div`
  margin-left: auto;

  .copyIcon {
    width: 1.3rem;
    transition: all 0.2s ease-in-out;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
      transform: scale(1.15);
    }
  }
`;

export default CopyIcon;
