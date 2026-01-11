import React, { useState } from "react";
import styled from "styled-components";
import { useShallow } from "zustand/shallow";

import passwordHideIcon from "../../../assets/svg/password-hide.svg";
import passwordShowIcon from "../../../assets/svg/password-show.svg";

import InputWrapper from "../../../components/InputWrapper";
import Wrapper from "../../../components/Wrapper";
import { REQUEST } from "../../../constants/index";
import useStore from "../../../store/useStore";

const RequestBasicAuth = () => {
  const {
    authData,
    handleRequestAuthData,
  } = useStore(
    useShallow((state) => ({
      authData: state.authData,
      handleRequestAuthData: state.handleRequestAuthData,
    }))
  );
  const [shouldShowPassword, setShouldShowPassword] = useState(false);

  return (
    <Wrapper>
      <InputWrapper>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={authData.username}
          onChange={(event) =>
            handleRequestAuthData(REQUEST.USERNAME, event.target.value)
          }
        />
      </InputWrapper>
      <InputWrapper>
        <label htmlFor="password">Password:</label>
        <div>
          <input
            type={shouldShowPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={authData.password}
            onChange={(event) =>
              handleRequestAuthData(REQUEST.PASSWORD, event.target.value)
            }
          />
          <PasswordIconButton type="button" onClick={() => setShouldShowPassword(!shouldShowPassword)}>
            <img src={shouldShowPassword ? passwordShowIcon : passwordHideIcon} />
          </PasswordIconButton>
        </div>
      </InputWrapper>
    </Wrapper>
  );
};

const PasswordIconButton = styled.button`
  width: auto;
  float: right;
  padding: 0;
  margin: -2.25rem -2rem 0 0;
  background: none;

  &:hover {
    background-color: transparent;
    opacity: 0.7;
  }
`;

export default RequestBasicAuth;
