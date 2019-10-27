import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// import AutosizeInput from "react-input-autosize";
import ContentEditable from "react-contenteditable";
import { maxlengthContentEditable } from "maxlength-contenteditable";
const APP_PATH = window.require("electron").remote.app.getAppPath();
const TEMP_PATH = `file:///${APP_PATH}/resource/temp/`;

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
`;

const TopContainer = styled.div`
  grid-area: name;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  height: 25px;
  /* display: flex;
  display: -webkit-flex; */
`;

const FileExtention = styled.div`
  display: inline-block;
  color: #d4d4d4;
`;

const BottomContainer = styled.div`
  grid-area: image;
  display: flex;
  justify-content: center;
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

const ImageWrapper = styled.div`
  width: 100%;
  margin: 10px 10px 0px 10px;
  text-align: center;
`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
`;

const ImageDetail = props => {
  const { id, data } = props;
  const imageSrc = `${TEMP_PATH}${id}`;

  useEffect(() => {
    maxlengthContentEditable();
  }, []);
  return (
    <Wrapper>
      <ContainerLeft />
      <ContainerRight>
        <TopContainer>
          <InputWrapper>
            <ContentEditable
              data-max-length="30"
              html={data.textData}
              className="content-editable"
            />
            <FileExtention>.png</FileExtention>
          </InputWrapper>
        </TopContainer>
        <BottomContainer>
          <ImageWrapper>
            <Image src={imageSrc} />
          </ImageWrapper>
        </BottomContainer>
      </ContainerRight>
    </Wrapper>
  );
};

export default ImageDetail;
