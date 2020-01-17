import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import {
  setBlockMaxImageWidth,
  setBlockMaxImageHeight
} from "../../../actions";

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

const MaxWrapper = styled.div``;

const Component = props => {
  const {
    setBlockMaxImageWidth,
    setBlockMaxImageHeight,
    blockMaxImageWidth,
    blockMaxImageHeight
  } = props;

  return (
    <Wrapper>
      <BlockHeader>
        Block : <BlockBy>Max Image Size</BlockBy>
      </BlockHeader>
      <InputWrapper>
        <MaxWrapper>
          <Description>Width (px)</Description>
          <NameInput
            value={blockMaxImageWidth}
            maxLength={4}
            onChange={e => {
              const _inputVal = e.target.value;
              const _regex = /[0-9]+$/;
              if (_inputVal !== "" && !_regex.test(_inputVal)) {
                return;
              }
              setBlockMaxImageWidth(_inputVal);
            }}
          ></NameInput>
        </MaxWrapper>
        <MaxWrapper>
          <Description>Height (px)</Description>
          <NameInput
            value={blockMaxImageHeight}
            maxLength={4}
            onChange={e => {
              console.log("start");
              console.log(e.target.value);
              const _inputVal = e.target.value;
              const _regex = /[0-9]+$/;
              if (_inputVal !== "" && !_regex.test(_inputVal)) {
                return;
              }
              setBlockMaxImageHeight(_inputVal);
            }}
          ></NameInput>
        </MaxWrapper>
      </InputWrapper>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  blockMaxImageWidth: state.get("blockMaxImageWidth"),
  blockMaxImageHeight: state.get("blockMaxImageHeight")
});

export default connect(mapStateToProps, {
  setBlockMaxImageWidth,
  setBlockMaxImageHeight
})(Component);
