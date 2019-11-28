import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";

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
  const ext = ".png";
  // insert blank title when text has only line break code.
  const regex = /^\s+$/;
  const title = regex.test(text) ? "　" : text;
  const component = format === "IMAGE" ? `${title}${ext}` : title;
  return (
    <Text format={format} isTrashed={isTrashed}>
      {component}
    </Text>
  );
};

const ItemText = props => {
  const { text, format, isTrashed } = props;
  return <Wrapper>{renderTitle(text, format, isTrashed)}</Wrapper>;
};

export default ItemText;
