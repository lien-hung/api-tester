import React, { useEffect } from "react";
import styled from "styled-components";
import { shallow, useShallow } from "zustand/shallow";

import { REQUEST } from "../../../constants/index";
import useStore from "../../../store/useStore";
import { KeyValueTableData } from "../../../store/slices/type";
import { generateParameterString, removeUrlParameter, usePrevious } from "../../../utils/index";
import getUrlParameters from "../../../utils/getUrlParameters";

const RequestUrl = () => {
  const {
    requestUrl,
    requestOption,
    keyValueTableData,
    handleRequestUrlChange,
    handleTreeViewTableData,
  } = useStore(
    useShallow((state) => ({
      requestUrl: state.requestUrl,
      requestOption: state.requestOption,
      keyValueTableData: state.keyValueTableData,
      handleRequestUrlChange: state.handleRequestUrlChange,
      handleTreeViewTableData: state.handleTreeViewTableData,
    }))
  );

  const prevTableData = usePrevious(keyValueTableData);
  const prevRequestUrl = usePrevious(requestUrl);

  useEffect(() => {
    // Case 1: Table data changed
    if (prevTableData.length !== keyValueTableData.length
      || prevTableData.some((param, i) => !shallow(param, keyValueTableData[i]))
    ) {
      if (requestOption !== REQUEST.PARAMS) return;

      const tableData = keyValueTableData.filter(
        (d) => d.optionType === REQUEST.PARAMS && d.isChecked,
      );

      const parameterString = generateParameterString(tableData);
      const baseUrl = removeUrlParameter(requestUrl);
      const newUrl = baseUrl + parameterString;
      handleRequestUrlChange(newUrl);
    }

    // Case 2: Request URL changed
    if (prevRequestUrl !== requestUrl) {
      const urlParams = getUrlParameters(requestUrl);
      const urlParamsCount = urlParams.length;
      const allParams = keyValueTableData.filter(d => d.optionType === REQUEST.PARAMS);
      let newParams: KeyValueTableData[] = [];

      // Map existing URL parameters to rows
      allParams.forEach(p => {
        if (p.isChecked && urlParams.length > 0) {
          p.key = urlParams[0].key;
          p.value = urlParams[0].value;
          urlParams.splice(0, 1);
        }
        newParams.push(p);
      });

      if (urlParams.length > 0) {
        newParams.splice(-1, 0, ...urlParams.map(p => ({
          id: crypto.randomUUID(),
          optionType: REQUEST.PARAMS,
          isChecked: true,
          key: p.key,
          value: p.value
        })));
      } else {
        // Remove excess params from the end of URL
        const toRemoveCount = newParams.filter(p => p.isChecked).length - urlParamsCount;
        const toRemove: KeyValueTableData[] = [];
        for (let i = newParams.length - 1; i >= 0 && toRemove.length < toRemoveCount; i--) {
          if (newParams[i].isChecked) toRemove.push(newParams[i]);
        }
        newParams = newParams.filter(p => !toRemove.some(r => r.id === p.id));
      }

      const otherRows = keyValueTableData.filter(d => d.optionType !== REQUEST.PARAMS);
      handleTreeViewTableData([...newParams, ...otherRows]);
    }
  }, [keyValueTableData, requestUrl]);

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
