import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import styled from "@emotion/styled";
import SortInput from "./SortInput";
import KeywordsInput from "./KeywordsInput";
import DataTypesInput from "./DataTypesInput";
import StatusInput from "./StatusInput";
import HotKeyInput from "./HotKeyInput";
import HashTagInput from "./HashTagInput";
import LanguageInput from "./LanguageInput";
import IdInput from "./IdInput";

const Wrapper = styled.div`
  font-family: sans-serif;
  display: grid;
  grid-template-columns: 53px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: "left right";
  width: 100%;
  height: 100%;
`;

const ContainerLeft = styled.div`
  grid-area: left;
  background-color: #2f3129;
  width: 100%;
`;
const ContainerRight = styled.div`
  grid-area: right;
  padding: 15px 30px;
  width: 100%;
`;

const Title = styled.div`
  color: #dddddd;
  font-size: 20px;
  margin-bottom: 20px;
`;

const FilterSettings = props => {
  return (
    <Wrapper>
      <ContainerLeft></ContainerLeft>
      <ContainerRight>
        <Title>Sort and Filter Settings</Title>
        <SortInput />
        <IdInput />
        <LanguageInput />
        <HashTagInput />
        {/* <HotKeyInput /> */}
        {/* <StatusInput /> */}
        {/* <DataTypesInput /> */}
        {/* <KeywordsInput /> */}
      </ContainerRight>
    </Wrapper>
  );
};

export default connect(null, null)(FilterSettings);
