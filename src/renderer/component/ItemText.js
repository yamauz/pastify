import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import path from "path";

const Wrapper = styled.div``;

const Text = styled.p`
  margin: 0 2px;
  padding-top: 3px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-line-clamp: ${props => {
    switch (props.format) {
      case "IMAGE":
      case "SHEET":
        return 1;
      default:
        return 2;
    }
  }};
  color: ${props => {
    switch (props.format) {
      case "TEXT":
        return "#bfd7de";
      case "IMAGE":
        return "#c3bfde";
      case "SHEET":
        return "#bfdebf";
      case "FILE":
        return "#dddebf";
    }
  }};
  opacity: ${props => (props.isTrashed ? 0.8 : 1)};
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: sans-serif;
  line-height: 1.2;
  font-size: 12px;
`;

const renderTitle = (text, format, isTrashed) => {
  return (
    <Text format={format} isTrashed={isTrashed}>
      {createTextData(format, text)}
    </Text>
  );
};

const createTextData = (format, text) => {
  const regex = /^\s+$/;
  const _text = regex.test(text) ? "　" : text;
  switch (format) {
    case "TEXT":
    case "SHEET":
      return _text;
    case "IMAGE":
      return `${_text}.png`;
    case "FILE":
      const fileList = _text.split("\n");
      const fileNames = fileList.map(f => path.basename(f));
      return fileNames.join("  ");

    default:
      break;
  }
};

const ItemText = props => {
  const { text, format, isTrashed } = props;
  return <Wrapper>{renderTitle(text, format, isTrashed)}</Wrapper>;
};

export default ItemText;
