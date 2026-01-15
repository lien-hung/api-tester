import React, { useEffect } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

import Loader from "../../../components/Loader";
import { COMMON, RESPONSE } from "../../../constants/index";
import useStore from "../../../store/useStore";
import ResponseEmptyMenu from "../Empty/ResponseEmptyMenu";
import ResponseErrorMenu from "../Error/ResponseErrorMenu";
import ResponseMenu from "../Menu/ResponseMenu";

const ResponsePanel = () => {
  const {
    responseData,
    requestInProcess,
    handleResponseData,
    handleRequestProcessStatus,
    handleTreeViewTableData,
    handleTreeViewClick,
  } = useStore(
    useShallow((state) => ({
      responseData: state.responseData,
      requestInProcess: state.requestInProcess,
      handleResponseData: state.handleResponseData,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
      handleTreeViewClick: state.handleTreeViewClick,
      handleTreeViewTableData: state.handleTreeViewTableData,
    }))
  );

  const handleExtensionMessage = (event: MessageEvent) => {
    if (event.data.type === RESPONSE.RESPONSE) {
      handleResponseData(event.data);
      handleRequestProcessStatus(COMMON.FINISHED);
    } else if (event.data.type === RESPONSE.ERROR) {
      handleResponseData(event.data);
      handleRequestProcessStatus(RESPONSE.ERROR);
    } else if (event.data.type === RESPONSE.TREEVIEW_DATA) {
      const {
        keyValueTableData,
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
        bodyRawData,
      } = event.data;

      handleTreeViewClick({
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
        bodyRawData,
      });

      handleTreeViewTableData(keyValueTableData);
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
  }, []);

  switch (requestInProcess) {
    case COMMON.LOADING:
      return (
        <ResponsePanelWrapper>
          <Loader />
        </ResponsePanelWrapper>
      );
    case COMMON.FINISHED:
      return (
        <ResponsePanelWrapper>
          <ResponseMenu />
        </ResponsePanelWrapper>
      );
    case RESPONSE.ERROR:
      return (
        <ResponsePanelWrapper>
          <ResponseErrorMenu {...responseData} />
        </ResponsePanelWrapper>
      );
    default:
      return (
        <ResponsePanelWrapper>
          <ResponseEmptyMenu />
        </ResponsePanelWrapper>
      );
  }
};

const ResponsePanelWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column;
  overflow: hidden;
  vertical-align: top;
  height: auto;
  max-height: 100vh;
  box-sizing: border-box;
`;

export default ResponsePanel;
