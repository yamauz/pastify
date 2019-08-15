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
  multiValue: (styles, { data }) => ({
    ...styles,
    backgroundColor: "green"
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    backgroundColor: "red"
    // color: data.color,
    // color: "red"
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

export default connect(
  mapStateToProps,
  { setLanguageFilterOptions, setIdsFromDatastore }
)(LanguageInput);
