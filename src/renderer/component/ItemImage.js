import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
const APP_PATH = window.require("electron").remote.app.getAppPath();

const Wrapper = styled.div`
  padding-top: 6px;
  padding-bottom: 6px;
  /* margin-top: 5px; */
  max-width: 200px;
  display: ${props => {
    switch (props.format) {
      case "IMAGE":
      case "SHEET":
        return "block";
      default:
        return "none";
    }
  }};
`;

const ImageWrapper = styled.div`
  max-width: 250px;
  text-align: left;
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 90px;
  height: 100%;
  border-radius: 5px;
  display: block;
`;

const renderImage = (id, format) => {
  const distDir = process.env.PORTABLE_EXECUTABLE_DIR || APP_PATH;
  const imagePath = `file:///${distDir}/resource/temp/images/${id}`;
  switch (format) {
    case "IMAGE":
    case "SHEET":
      return (
        <ImageWrapper>
          <Image src={imagePath} />
        </ImageWrapper>
      );
    default:
      return <></>;
  }
};

const ItemImage = props => {
  return (
    <Wrapper format={props.format}>
      {renderImage(props.id, props.format, props.measure)}
      {/* <img src={imageSrc} alt="" /> */}
    </Wrapper>
  );
};

export default ItemImage;
