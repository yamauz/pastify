import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { StripeProvider } from "react-stripe-elements";
import StoreCheckout from "./StoreCheckout";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 53px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: "left right";
  width: 100%;
  height: 100%;
  font-family: sans-serif;
  height: calc(100vh - 91px);
`;

const ContainerLeft = styled.div`
  grid-area: left;
  background-color: #2f3129;
  width: 100%;
`;
const ContainerRight = styled.div`
  grid-area: right;
  padding: 15px 30px;
  overflow: overlay;
  -webkit-background-clip: text;
  transition: background-color 0.3s;
  &::-webkit-scrollbar {
    width: 0.5em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: inherit;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const Title = styled.div`
  color: #dddddd;
  font-size: 20px;
  margin-bottom: 25px;
`;
const SubTitle = styled.div`
  color: #dddddd;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Component = props => {
  return (
    <Wrapper>
      <ContainerLeft></ContainerLeft>
      <ContainerRight>
        <Title>Subscription Settings</Title>
        <StripeProvider apiKey="pk_test_deqOFQEjLy345ScRmw7Jd0Df00lgXcmmPP">
          <StoreCheckout />
        </StripeProvider>
      </ContainerRight>
    </Wrapper>
  );
};

export default connect(null, null)(Component);
