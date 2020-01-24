import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { setMaxDayTrash } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  color: #bbbbbb;
`;
const SubTitle = styled.span`
  font-size: 12px;
  color: #dddddd;
`;

const Description = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const FileCountInput = styled.input`
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
  const { setMaxDayTrash, maxDayTrash } = props;

  return (
    <Wrapper>
      <Title>
        Clip Saving Period : <SubTitle>Max Day Trash</SubTitle>
      </Title>
      <Description>Max Day Trash</Description>
      <FileCountInput
        value={maxDayTrash}
        maxLength={3}
        onChange={e => {
          const _inputVal = e.target.value;
          const _regex = /^[0-9]+$/;
          if (_inputVal !== "" && !_regex.test(_inputVal)) {
            return;
          }
          setMaxDayTrash(_inputVal);
        }}
      ></FileCountInput>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  maxDayTrash: state.get("maxDayTrash")
});

export default connect(mapStateToProps, {
  setMaxDayTrash
})(Component);
