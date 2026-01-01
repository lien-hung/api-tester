import React from "react";

import RequestPanel from "../features/Request/Panel/RequestPanel";
import ResizeBar from "../features/ResizeBar/ResizeBar";
import ResponsePanel from "../features/Response/Panel/ResponsePanel";
import styled from "styled-components";

function MainPage() {
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