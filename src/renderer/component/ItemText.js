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
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #bfd7de;
  font-family: sans-serif;
  line-height: 1.2;
  font-size: 12px;
`;

const renderTitle = (text, format) => {
  const ext = ".png";
  // insert blank title when text has only line break code.
  const regex = /^\s+$/;
  // const title = text === "\r\n" ? "　" : text;
  const title = regex.test(text) ? "　" : text;
  const component = format === "IMAGE" ? `${title}${ext}` : title;
  return <Text format={format}>{component}</Text>;
};

const ItemText = props => {
  return <Wrapper>{renderTitle(props.text, props.format)}</Wrapper>;
};

export default ItemText;
