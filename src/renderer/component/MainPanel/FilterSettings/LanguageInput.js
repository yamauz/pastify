import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
// import Select from "react-select";
import {
  setLanguageFilterOptions,
  setIdsFromDatastore
} from "../../../actions";
import Select from "react-select";
import setUnsetOptions from "../../../../common/setUnsetOptions";
import langOptions from "../../../../common/langOptions";

import styled from "@emotion/styled";

const Wrapper = styled.div``;

const LanguageInput = props => {
  const {
    languageFilterOpt,
    setLanguageFilterOptions,
    setIdsFromDatastore
  } = props;
  return (
    <Wrapper>
      <Select
        placeholder={"Select Language"}
        isMulti
        options={setLanguageOptions(languageFilterOpt)}
        // defaultValue={languageFilterOpt}
        value={languageFilterOpt}
        styles={customStyles}
        onChange={opt => {
          const options = opt === null ? [] : opt;
          setLanguageFilterOptions(options);
          setIdsFromDatastore();
        }}
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
    "&:hover": { color: "#ffffff" }
  }),
  dropdownIndicator: (styles, { data }) => ({
    ...styles,
    color: "#bbbbbb",
    "&:hover": { color: "#ffffff" }
  }),
  option: (provided, state) => ({
    ...provided,
    color: "#dddddd",
    backgroundColor: state.isFocused ? "#354154" : "none",
    "&:hover": { backgroundColor: "#2F353D" },
    padding: "5px"
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
    height: "25px",
    minHeight: "25px"
  }),
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "#0f2446",
    height: 18,
    fontSize: 13,
    lineHeight: 1,
    color: "#dddddd"
  }),
  input: (styles, { data }) => ({
    ...styles,
    color: "#dddddd"
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: "#dddddd"
  })
  // multiValueRemove: (styles, { data }) => ({
  //   ...styles,
  //   color: data.color,
  //   ':hover': {
  //     backgroundColor: data.color,
  //     color: 'white',
  //   },
  // }),
};

const setLanguageOptions = languageFilterOpt => {
  let nextOptions;
  if (languageFilterOpt.length === 0) {
    nextOptions = [...setUnsetOptions, ...langOptions];
  } else {
    switch (languageFilterOpt[0].value) {
      case "__SET__":
      case "__UNSET__":
        nextOptions = [];
        break;
      default:
        nextOptions = [...langOptions];
        break;
    }
  }
  return nextOptions;
};

const mapStateToProps = state => ({
  languageFilterOpt: state.get("languageFilterOpt")
});

export default connect(mapStateToProps, {
  setLanguageFilterOptions,
  setIdsFromDatastore
})(LanguageInput);
