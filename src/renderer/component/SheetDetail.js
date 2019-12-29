import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
const APP_PATH = window.require("electron").remote.app.getAppPath();

const Wrapper = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 53px 1fr;
  grid-template-rows: 100%;
  grid-template-areas: "left right";
  height: 100%;
  width: 100%;
`;
const ContainerLeft = styled.div`
  grid-area: left;
  background-color: #2f3129;
  width: 100%;
`;
const ContainerRight = styled.div`
  grid-area: right;
  overflow: overlay;
  display: flex;
  justify-content: center;
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

const SheetDetail = props => {
  const { id } = props;
  const distDir = process.env.PORTABLE_EXECUTABLE_DIR || APP_PATH;
  const imagePath = `file:///${distDir}/resource/temp/images/${id}`;

  return (
    <Wrapper>
      <ContainerLeft />
      <ContainerRight>
        <ImageWrapper>
          <Image src={imagePath} />
        </ImageWrapper>
      </ContainerRight>
    </Wrapper>
  );
};

export default SheetDetail;
