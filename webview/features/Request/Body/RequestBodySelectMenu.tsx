import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

import SelectWrapper from "../../../components/SelectWrapper";
import { COMMON, OPTION, REQUEST } from "../../../constants/index";
import useStore from "../../../store/useStore";
import RequestBodyFormatButton from "../Button/RequestBodyFormatButton";
import RequestBodyRawOptions from "./RequestBodyRawOptions";
import RequestBodyMenuOption from "./RequestBodySelectMenuOption";

const RequestBodySelectMenu = () => {
  const {
    bodyOption,
    bodyRawOption,
    handleRequestBodyOption,
    addRequestBodyHeaders,
    removeRequestBodyHeaders,
  } = useStore(
    useShallow((state) => ({
      bodyOption: state.bodyOption,
      bodyRawOption: state.bodyRawOption,
      handleRequestBodyOption: state.handleRequestBodyOption,
      addRequestBodyHeaders: state.addRequestBodyHeaders,
      removeRequestBodyHeaders: state.removeRequestBodyHeaders,
    }))
  );

  const rawOptionHeaderField = OPTION.REQUEST_BODY_RAW_OPTIONS.filter(
    (rawOption) => rawOption.option === bodyRawOption,
  );

  const handleBodyOptionChoice = (event: ChangeEvent<HTMLInputElement>) => {
    const inputTarget = event.target;
    handleRequestBodyOption(inputTarget.value);

    if (event.target.value === REQUEST.NONE) {
      removeRequestBodyHeaders();
    } else {
      removeRequestBodyHeaders();

      addRequestBodyHeaders(inputTarget.getAttribute("header-type") || "");
    }
  };

  return (
    <>
      <SelectWrapper primary={false} secondary={false} requestMenu>
        {OPTION.REQUEST_BODY_OPTIONS.map(({ option, headerField }, index) => (
          <RadioInputWrapper key={COMMON.BODY + index}>
            <label>
              <input
                type="radio"
                name="bodyOption"
                checked={bodyOption === option}
                value={option}
                header-type={
                  option === REQUEST.RAW
                    ? rawOptionHeaderField[0].headerField
                    : headerField
                }
                onChange={handleBodyOptionChoice}
              />
              <span>{option}</span>
            </label>
          </RadioInputWrapper>
        ))}
        {bodyOption === REQUEST.RAW && (
          <>
            <RequestBodyRawOptions />
            <RequestBodyFormatButton />
          </>
        )}
      </SelectWrapper>
      <RequestBodyMenuOption />
    </>
  );
};

const RadioInputWrapper = styled.div`
  margin: 0.5rem 1rem 0.5rem 0;

  label {
    display: flex;
    user-select: none;
    position: relative;

    input {
      appearance: none;
      position: absolute;
      left: 0;

      &:before {
        content: '';
        position: absolute;
        width: 14px; height: 14px;
        border: 1px solid rgba(128, 128, 128, 0.7);
        border-radius: 100%;
        left: 0;
      }

      &:checked:after {
        content: '';
        position: absolute;
        left: 3px; top: 3px;
        background: var(--vscode-button-background);
        width: 8px; height: 8px;
        border-radius: 100%;
      }
    }

    span {
      padding-left: 2rem;
    }
  }
`;

export default RequestBodySelectMenu;
