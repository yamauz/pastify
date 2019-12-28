import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import _ from "lodash";
import ContextMenu from "./ContextMenu";
import TextLanguage from "./TextLanguage";
import Key from "./Key";
import Hash from "./Hash";
import path from "path";

const Wrapper = styled.div`
  font-family: sans-serif;
  transition: background-color 0.1s;
  height: 100%;
  overflow: hidden;
  border-bottom: solid 1px #1d1d1d;
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
const Text = styled.span`
  max-width: 255px;
  vertical-align: middle;
  display: inline-block;
  text-align: left;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 4px;
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
  font-size: 12px;
`;

const DetectPosBlockTop = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  z-index: 200;
`;

const DetectPosBlockBottom = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  bottom: 0;
  left: 0;
  z-index: 200;
`;

const TextWrapper = styled.div`
  padding-left: 10px;
  padding-right: 25px;
`;

const ItemCompact = props => {
  const { style, item, index } = props;
  const { id, mainFormat, textData, isFaved, isTrashed, key, lang, tag } = item;
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
      {renderTitle(textData, mainFormat, isTrashed, key, lang, tag)}
    </Wrapper>
  );
};

const renderTitle = (text, format, isTrashed, key, lang, tag) => {
  return (
    <TextWrapper>
      <Text format={format} isTrashed={isTrashed}>
        {createTextData(format, text)}
      </Text>
      <Key keyTag={key} />
      <TextLanguage lang={lang} />
      <Hash tag={tag} />
    </TextWrapper>
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

export default ItemCompact;
