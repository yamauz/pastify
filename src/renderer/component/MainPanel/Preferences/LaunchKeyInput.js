import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setLaunchKeyOptions, setLaunchKeyDuration } from "../../../actions";
import Select from "react-select";
import launchKeyOptions from "../../../../common/launchKeyOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.div`
  color: #bbbbbb;
`;

const InputWrapper = styled.div`
  display: flex;
`;

const DrationWrapper = styled.div``;
const SelectWrapper = styled.div`
  width: 200px;
`;

const Description = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const DurationInput = styled.input`
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

const BlockDatatypesInput = props => {
  const {
    launchKeyDuration,
    launchKeyOpt,
    setLaunchKeyOptions,
    setLaunchKeyDuration
  } = props;
  return (
    <Wrapper>
      <Title>Launch Key</Title>
      <InputWrapper>
        <DrationWrapper>
          <Description>Duration (ms)</Description>
          <DurationInput
            value={launchKeyDuration}
            maxLength={4}
            onChange={e => {
              const _inputVal = e.target.value;
              const _regex = /[0-9]+$/;
              if (_inputVal !== "" && !_regex.test(_inputVal)) {
                return;
              }
              setLaunchKeyDuration(_inputVal);
            }}
          ></DurationInput>
        </DrationWrapper>
        <SelectWrapper>
          <Description>Key</Description>
          <Select
            noOptionsMessage={() => null}
            menuPosition={"fixed"}
            placeholder={null}
            options={launchKeyOptions}
            // defaultValue={launchKeyOpt}
            value={launchKeyOpt}
            styles={customStyles}
            onChange={opt => {
              const options = opt === null ? [] : opt;
              setLaunchKeyOptions(options);
            }}
          />
        </SelectWrapper>
      </InputWrapper>
    </Wrapper>
  );
};

const customStyles = {
  indicatorSeparator: (styles, { data }) => ({
    ...styles,
    display: "none"
  }),
  clearIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    padding: 2,
    "&:hover": { color: "#ffffff" }
  }),
  dropdownIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    padding: 2,
    "&:hover": { color: "#ffffff" }
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    fontSize: "11px",
    fontStyle: state.data.fontStyle,
    padding: "5px"
  }),
  menu: (provided, state) => ({
    ...provided,
    maxWidth: "200px"
  }),
  menuList: (provided, state) => ({
    ...provided,
    borderRadius: "0px",
    backgroundColor: "#333335"
  }),
  control: (styles, state) => ({
    ...styles,
    backgroundColor: "#333335",
    "&:hover": { border: state.isFocused ? "solid 1px #5c5d37" : "none" },
    border: state.isFocused ? "solid 1px #5c5d37" : "none",
    boxShadow: "none", // no box-shadow
    borderRadius: "0px",
    minHeight: "25px",
    maxWidth: "200px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  singleValue: base => ({
    ...base,
    color: "#dcdcdc",
    fontSize: 12
  }),
  input: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    margin: 0,
    padding: 0
  })
};

const mapStateToProps = state => ({
  launchKeyOpt: state.get("launchKeyOpt"),
  launchKeyDuration: state.get("launchKeyDuration")
});

export default connect(mapStateToProps, {
  setLaunchKeyOptions,
  setLaunchKeyDuration
})(BlockDatatypesInput);
