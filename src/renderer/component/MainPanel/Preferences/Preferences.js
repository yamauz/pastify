import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import styled from "@emotion/styled";
import SortInput from "./SortInput";
import BlockKeywordsInput from "./BlockKeywordsInput";
import BlockDataTypesInput from "./BlockDataTypesInput";
import BlockTextLengthRangeInput from "./BlockTextLengthRangeInput";
import BlockImageSizeRangeInput from "./BlockImageSizeRangeInput";
import BlockFileCountInput from "./BlockFileCountInput";
import LaunchKeyInput from "./LaunchKeyInput";
import MaxTextLengthInput from "./MaxTextLengthInput";
import MaxImageSize from "./MaxImageSize";
import MaxFileLength from "./MaxFileLength";
import MaxDayTrash from "./MaxDayTrash";
import MaxDayDelete from "./MaxDayDelete";
import HotKeyInput from "./HotKeyInput";
import HashTagInput from "./HashTagInput";
import LanguageInput from "./LanguageInput";
import IdInput from "./IdInput";
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
  margin-bottom: 25px;
`;
const SubTitle = styled.div`
  color: #dddddd;
  font-size: 16px;
  margin-bottom: 20px;
`;

const Preferences = props => {
  return (
    <Wrapper>
      <ContainerLeft></ContainerLeft>
      <ContainerRight>
        <Title>Preferences</Title>
        <SubTitle>Launch</SubTitle>
        <LaunchKeyInput />
        <SubTitle>Block</SubTitle>
        <BlockKeywordsInput />
        <BlockDataTypesInput />
        <BlockTextLengthRangeInput />
        <BlockImageSizeRangeInput />
        <BlockFileCountInput />
        <SubTitle>Resize</SubTitle>
        <MaxTextLengthInput />
        <MaxImageSize />
        <MaxFileLength />
        <SubTitle>TimeLine</SubTitle>
        <MaxDayTrash />
        <MaxDayDelete />
        {/* <StatusInput /> */}
        {/* <LanguageInput /> */}
        {/* <HashTagInput /> */}
        {/* <HotKeyInput /> */}
        {/* <SortInput /> */}
        {/* <Title>Save This Settings</Title> */}
        {/* <FilterNameInput /> */}
        {/* <KeybindingsInput /> */}
        {/* <SaveButton /> */}
      </ContainerRight>
    </Wrapper>
  );
};

export default connect(null, null)(Preferences);
