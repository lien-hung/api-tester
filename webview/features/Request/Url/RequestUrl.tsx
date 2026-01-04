import React, { useEffect } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

import { REQUEST } from "../../../constants/index";
import useStore from "../../../store/useStore";
import { generateParameterString, removeUrlParameter } from "../../../utils/index";

const RequestUrl = () => {
  const {
    requestUrl,
    requestOption,
    keyValueTableData,
    handleRequestUrlChange,
  } = useStore(
    useShallow((state) => ({
      requestUrl: state.requestUrl,
      requestOption: state.requestOption,
      keyValueTableData: state.keyValueTableData,
      handleRequestUrlChange: state.handleRequestUrlChange,
    }))
  );

  useEffect(() => {
    if (requestOption !== REQUEST.PARAMS) return;

    const filteredData = keyValueTableData.filter(
      (data) => data.optionType === REQUEST.PARAMS && data.isChecked,
    );

    const parameterString = generateParameterString(filteredData);
    const parameterRemovedUrl = removeUrlParameter(requestUrl);
    const newUrlWithParams = parameterRemovedUrl + parameterString;

    handleRequestUrlChange(newUrlWithParams);
  }, [keyValueTableData]);

  return (
    <InputContainer
      placeholder="Enter request URL"
      value={requestUrl}
      onChange={(event) => handleRequestUrlChange(event.target.value)}
    />
  );
};

const InputContainer = styled.input`
  padding-left: 1rem;
  font-size: 1.15rem;
  background-color: var(--vscode-editor-background);
  color: var(--vscode-foreground);
`;

export default RequestUrl;
