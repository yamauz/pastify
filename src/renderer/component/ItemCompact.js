import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import _ from "lodash";

const Wrapper = styled.div`
  transition: background-color 0.1s;
  height: 100%;
  border-bottom: solid 1px #1d1d1d;
  &:hover {
    background-color: rgba(110, 148, 255, 0.05);
  }
  background-color: ${props => {
    return props.index % 2 ? "#2b2b2b6e" : "inherit";
  }};
`;
const Text = styled.p`
  padding-top: 4px;
  margin-left: 10px;
  text-align: left;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #bfd7de;
  font-family: sans-serif;
  font-size: 12px;
`;

const ItemCompact = props => {
  const { style, item, index } = props;

  const {
    id,
    date,
    mainFormat,
    textData,
    key,
    lang,
    tag,
    isFaved,
    isTrashed
  } = item;

  return (
    <Wrapper index={index} id={id} style={style} className="list-item">
      {renderTitle(textData, mainFormat)}
    </Wrapper>
  );
};

const renderTitle = (text, format) => {
  const ext = ".png";
  // insert blank title when text has only line break code.
  const regex = /^\s+$/;
  const title = regex.test(text) ? "　" : text;
  const component = format === "IMAGE" ? `${title}${ext}` : title;
  return <Text format={format}>{component}</Text>;
};

export default ItemCompact;
