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
import FilterNameInput from "./FilterNameInput";
import KeybindingsInput from "./KeybindingsInput";
import SaveButton from "./SaveButton";

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
  margin-bottom: 20px;
`;

const FilterSettings = props => {
  return (
    <Wrapper>
      <ContainerLeft></ContainerLeft>
      <ContainerRight>
        <Title>Sort and Filter Settings</Title>
        <KeywordsInput />
        <IdInput />
        <StatusInput />
        <DataTypesInput />
        <LanguageInput />
        <HashTagInput />
        <HotKeyInput />
        <SortInput />
        <Title>Save This Settings</Title>
        <FilterNameInput />
        <KeybindingsInput />
        <SaveButton />
      </ContainerRight>
    </Wrapper>
  );
};

export default connect(null, null)(FilterSettings);
