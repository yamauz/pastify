import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import _ from "lodash";
import ContextMenu from "./ContextMenu";

const Wrapper = styled.div`
  transition: background-color 0.1s;
  height: 100%;
  border-bottom: solid 1px #1d1d1d;
  padding-right: 20px;
  &:before {
    content: "";
    top: 0;
    left: 0;
    border-bottom: 0.6em solid transparent;
    border-left: ${props => {
      return props.isFaved ? "0.6em solid #bab586" : "0.5em solid inherit";
    }};
    position: absolute;
    z-index: 100;
  }
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
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  font-family: sans-serif;
  font-size: 12px;
`;

const DetectPosBlockTop = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
`;

const DetectPosBlockBottom = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  bottom: 0;
  left: 0;
`;

const ItemCompact = props => {
  const { style, item, index } = props;
  const { id, mainFormat, textData, isFaved, isTrashed } = item;
  const [isOpen, setIsOpen] = useState(false);
  const toggleDeleteButton = () => setIsOpen(!isOpen);

  return (
    <Wrapper
      index={index}
      id={id}
      style={style}
      isFaved={isFaved}
      className="list-item"
      onMouseEnter={toggleDeleteButton}
      onMouseLeave={toggleDeleteButton}
    >
      <ContextMenu index={index} id={id} isOpen={isOpen} />
      <DetectPosBlockTop id="detect-pos-block" />
      <DetectPosBlockBottom id="detect-pos-block" />
      {renderTitle(textData, mainFormat, isTrashed)}
    </Wrapper>
  );
};

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

export default ItemCompact;
