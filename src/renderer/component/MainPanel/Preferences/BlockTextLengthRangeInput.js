import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { setBlockMaxTextLength, setBlockMinTextLength } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const BlockHeader = styled.div`
  color: #bbbbbb;
`;
const BlockBy = styled.span`
  font-size: 12px;
  color: #dddddd;
`;

const Description = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const NameInput = styled.input`
  margin-right: 10px;
  background-color: #333335;
  border: none;
  height: 25px;
  padding-left: 8px;
  caret-color: #eeeeee;
  color: #dddddd;
  width: 100px;
  &:focus {
    border: solid 1px #5c5d37;
  }
`;

const InputWrapper = styled.div`
  display: flex;
`;

const MinMaxWrapper = styled.div``;

const Component = props => {
  const {
    setBlockMaxTextLength,
    setBlockMinTextLength,
    blockMaxTextLength,
    blockMinTextLength
  } = props;

  return (
    <Wrapper>
      <BlockHeader>
        Block : <BlockBy>Text Length Range</BlockBy>
      </BlockHeader>
      <InputWrapper>
        <MinMaxWrapper>
          <Description>Min</Description>
          <NameInput
            value={blockMinTextLength}
            maxLength={6}
            onChange={e => {
              const _inputVal = e.target.value;
              const _regex = /^[0-9]+$/;
              if (_inputVal !== "" && !_regex.test(_inputVal)) {
                return;
              }
              setBlockMinTextLength(_inputVal);
            }}
          ></NameInput>
        </MinMaxWrapper>
        <MinMaxWrapper>
          <Description>Max</Description>
          <NameInput
            value={blockMaxTextLength}
            maxLength={6}
            onChange={e => {
              const _inputVal = e.target.value;
              const _regex = /^[0-9]+$/;
              if (_inputVal !== "" && !_regex.test(_inputVal)) {
                return;
              }
              setBlockMaxTextLength(_inputVal);
            }}
          ></NameInput>
        </MinMaxWrapper>
      </InputWrapper>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  blockMaxTextLength: state.get("blockMaxTextLength"),
  blockMinTextLength: state.get("blockMinTextLength")
});

export default connect(mapStateToProps, {
  setBlockMaxTextLength,
  setBlockMinTextLength
})(Component);
