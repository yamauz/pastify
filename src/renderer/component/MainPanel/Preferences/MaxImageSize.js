import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { setMaxImageSize } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Header = styled.div`
  color: #bbbbbb;
`;
const By = styled.span`
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

const Component = props => {
  const { setMaxImageSize, maxImageSize } = props;

  return (
    <Wrapper>
      <Header>
        Reize : <By>Max Image Size</By>
      </Header>
      <Description>size (px)</Description>
      <NameInput
        value={maxImageSize}
        maxLength={4}
        onChange={e => {
          const _inputVal = e.target.value;
          const _regex = /^[0-9]+$/;
          if (_inputVal !== "" && !_regex.test(_inputVal)) {
            return;
          }
          setMaxImageSize(_inputVal);
        }}
      ></NameInput>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  maxImageSize: state.get("maxImageSize")
});

export default connect(mapStateToProps, {
  setMaxImageSize
})(Component);
