import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
// Components
import { connect } from "react-redux";
import { setKeyboardHandler } from "../actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faKeyboard } from "@fortawesome/free-regular-svg-icons";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  background-color: #404040;
  cursor: default;
  pointer-events: none;
`;

const Left = styled.div`
  max-width: 300px;
  flex-grow: 2;
  display: flex;
  align-items: center;
`;
const Right = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  display: inline-block;
  text-align: center;
  width: 20px;
`;

const TextWrapper = styled.div`
  display: inline-block;
  width: 210px;
`;

const ItemText = styled.p`
  text-align: left;
  padding-left: 3px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #b5b5b5;
  font-family: sans-serif;
  font-size: 11px;
`;

const ModeWrapper = styled.div`
  display: inline-block;
  width: 45px;
`;
const Mode = styled.p`
  cursor: pointer;
  user-select: none;
  text-align: left;
  padding-left: 3px;
  color: #b5b5b5;
  font-family: sans-serif;
  font-size: 11px;
`;

const Container = props => {
  const { itemClipboard, setKeyboardHandler, keyboardHandler } = props;

  return (
    <Wrapper id="footer">
      <Left>
        <IconWrapper>
          <FontAwesomeIcon
            fixedWidth
            icon={faPaperclip}
            size="sm"
            color={"#d4d4d4"}
          />
        </IconWrapper>
        <TextWrapper>
          <ItemText>{itemClipboard.text}</ItemText>
        </TextWrapper>
      </Left>
      <Right>
        <IconWrapper>
          <FontAwesomeIcon
            fixedWidth
            icon={faKeyboard}
            size="sm"
            color={"#d4d4d4"}
          />
        </IconWrapper>
        <ModeWrapper
          onClick={() => {
            setKeyboardHandler();
          }}
        >
          <Mode>{checkMode(keyboardHandler)}</Mode>
        </ModeWrapper>
      </Right>
    </Wrapper>
  );
};

const checkMode = mode => {
  const _mode = mode === "" ? "normal" : mode;
  return _mode;
};

const mapStateToProps = state => ({
  itemClipboard: state.get("itemClipboard"),
  keyboardHandler: state.get("keyboardHandler")
});

export default connect(mapStateToProps, { setKeyboardHandler })(Container);
