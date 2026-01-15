import React from "react";
import styled from "styled-components";
import { IDetailOptionProps } from "./type";

const DetailOption = ({ children, requestMenu }: IDetailOptionProps) => {
  return (
    <DetailOptionWrapper purpose={requestMenu}>{children}</DetailOptionWrapper>
  );
};

const DetailOptionWrapper = styled.div<{ purpose?: boolean }>`
  display: flex;
  justify-content: ${(props) => props.purpose ? "" : "space-between"};
  margin: 0;
  padding-left: ${(props) => props.purpose ? "1.3rem" : "0"};
  flex: 0 1 auto;
  border-bottom: 1px solid rgba(128, 128, 128, 0.7);
  
  p {
    padding-bottom: 0.65rem;
    color: rgb(66 245 66);
    transform: translateX(-1.8rem);
    user-select: none;
  }
`;

export default DetailOption;
