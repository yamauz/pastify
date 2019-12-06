import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import { setStatusFilterOptions, setIdsFromDatastore } from "../../../actions";
import Select from "react-select";
import keybindingsOptions from "../../../../common/keybindingsOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin-bottom: 20px;
`;

const FilterHeader = styled.div`
  color: #bbbbbb;
`;

const FilterDescription = styled.div`
  font-size: 10px;
  color: #bbbbbb;
  margin-bottom: 5px;
`;

const Component = props => {
  const {
    statusFilterOpt,
    setStatusFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <FilterHeader>Keybindings</FilterHeader>
      <FilterDescription>
        Select a number for calling this settings with Alt key
      </FilterDescription>
      <Select
        noOptionsMessage={() => null}
        menuPosition={"fixed"}
        placeholder={null}
        options={keybindingsOptions}
        // options={setkeybindingsOptions(statusFilterOpt)}
        // value={statusFilterOpt}
        styles={customStyles}
        // onChange={opt => {
        //   const options = opt === null ? [] : opt;
        //   setStatusFilterOptions(options);
        //   setIdsFromDatastore();
        // }}
      />
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
    padding: "5px 5px 5px 10px"
  }),
  menu: (provided, state) => ({
    ...provided,
    maxWidth: "100px"
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
    maxWidth: "100px"
  }),
  valueContainer: base => ({
    ...base,
    padding: "0px 6px"
  }),
  multiValue: (styles, state) => ({
    ...styles,
    backgroundColor: state.data.color,
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd",
    paddingLeft: -5
  }),
  input: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    margin: 0,
    padding: 0
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#dddddd",
    "&:hover": { color: "#ffffff" }
  }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    backgroundColor: state.data.color,
    opacity: state.isFocused ? "1" : "0.5",
    "&:hover": {
      backgroundColor: state.data.color,
      color: "#fff",
      opacity: "1"
    }
  })
};

const setkeybindingsOptions = options => {
  const nextOptions = options.length < 1 ? keybindingsOptions : [];
  return nextOptions;
};

const mapStateToProps = state => ({
  statusFilterOpt: state.get("statusFilterOpt")
});

export default connect(mapStateToProps, {
  setStatusFilterOptions,
  setIdsFromDatastore
})(Component);
