import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setStatusFilterOptions, setIdsFromDatastore } from "../../../actions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 60px;
  height: 25px;
  font-size: 11px;
  background-color: #715050;
  border: none;
  color: #dddddd;
  transition: background-color 0.1s;
  &:hover {
    background-color: #ab7070;
  }
`;

const Component = props => {
  const {
    statusFilterOpt,
    setStatusFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <Button>Save</Button>
    </Wrapper>
  );
};

const mapStateToProps = state => ({
  statusFilterOpt: state.get("statusFilterOpt")
});

export default connect(mapStateToProps, {
  setStatusFilterOptions,
  setIdsFromDatastore
})(Component);
