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
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr;
  grid-template-areas:
    "name"
    "image";
  padding: 30px;
`;

const FilterSettings = props => {
  return (
    <Wrapper>
      <ContainerLeft></ContainerLeft>
      <ContainerRight>
        {/* <IdInput /> */}
        <LanguageInput />
        {/* <HashTagInput /> */}
        {/* <HotKeyInput /> */}
        {/* <StatusInput /> */}
        {/* <DataTypesInput /> */}
        {/* <SortInput /> */}
        {/* <KeywordsInput /> */}
      </ContainerRight>
    </Wrapper>
  );
};

export default connect(null, null)(FilterSettings);
