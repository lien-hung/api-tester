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
    handleSidebarCollectionHeaders,
    handleSidebarCollectionClick,
  } = useStore(
    useShallow((state) => ({
      responseData: state.responseData,
      requestInProcess: state.requestInProcess,
      handleResponseData: state.handleResponseData,
      handleRequestProcessStatus: state.handleRequestProcessStatus,
      handleSidebarCollectionClick: state.handleSidebarCollectionClick,
      handleSidebarCollectionHeaders: state.handleSidebarCollectionHeaders,
    }))
  );

  const handleExtensionMessage = (event: MessageEvent) => {
    if (event.data.type === RESPONSE.RESPONSE) {
      handleResponseData(event.data);
      handleRequestProcessStatus(COMMON.FINISHED);
    } else if (event.data.type === RESPONSE.ERROR) {
      handleResponseData(event.data);
      handleRequestProcessStatus(RESPONSE.ERROR);
    } else if (event.data.type === RESPONSE.COLLECTION_REQUEST) {
      handleRequestProcessStatus(COMMON.LOADING);
    } else if (event.data.type === RESPONSE.SIDEBAR_DATA) {
      const {
        keyValueTableData,
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
      } = event.data;

      handleSidebarCollectionClick({
        authData,
        authOption,
        requestUrl,
        requestMethod,
        bodyOption,
        bodyRawOption,
      });

      handleSidebarCollectionHeaders(keyValueTableData);
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
  margin: 2rem 1rem;
  overflow: hidden;
  vertical-align: top;
  height: auto;
  max-height: calc(100vh - 4rem);
  box-sizing: border-box;
`;

export default ResponsePanel;
