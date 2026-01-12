import React, { useEffect } from "react";
import styled from "styled-components";

import RequestPanel from "../features/Request/Panel/RequestPanel";
import ResizeBar from "../features/ResizeBar/ResizeBar";
import ResponsePanel from "../features/Response/Panel/ResponsePanel";

import { COMMON } from "../constants";
import useStore from "../store/useStore";
import { ExtensionConfig } from "../store/slices/type";

function MainPage() {
  const setConfig = useStore((state) => state.setConfig);
  
  const handleExtensionMessage = (event: MessageEvent) => {
    if (event.data.type === COMMON.HAS_CONFIG) {
      const config = JSON.parse(event.data.config) as ExtensionConfig;
      setConfig(config);
    }
  };

  vscode.postMessage({ command: COMMON.INIT_CONFIG });

  useEffect(() => {
    window.addEventListener("message", handleExtensionMessage);
  }, []);

  return (
    <MainPageWrapper>
      <RequestPanel />
      <ResizeBar />
      <ResponsePanel />
    </MainPageWrapper>
  );
};

const MainPageWrapper = styled.div`
  display: flex;
`

export default MainPage;