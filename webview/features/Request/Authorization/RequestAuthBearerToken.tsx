import React from "react";
import { useShallow } from "zustand/shallow";

import InputWrapper from "../../../components/InputWrapper";
import Wrapper from "../../../components/Wrapper";
import { REQUEST } from "../../../constants/index";
import useStore from "../../../store/useStore";

const RequestAuthBearerToken = () => {
  const { authDataToken, handleRequestAuthData } = useStore(
    useShallow((state) => ({
      authDataToken: state.authData.token,
      handleRequestAuthData: state.handleRequestAuthData,
    }))
  );

  return (
    <Wrapper>
      <InputWrapper>
        <label htmlFor="token">Token:</label>
        <input
          name="token"
          placeholder="Token"
          value={authDataToken}
          onChange={(event) =>
            handleRequestAuthData(REQUEST.TOKEN, event.target.value)
          }
        />
      </InputWrapper>
    </Wrapper>
  );
};

export default RequestAuthBearerToken;
